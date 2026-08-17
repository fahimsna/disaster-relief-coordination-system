const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const stripe = require("../config/stripe");

// =====================================================
// FINALIZE PAID DONATION
// =====================================================
//
// This helper makes payment processing safe when both
// the Stripe webhook and the receipt endpoint try to
// finalize the same donation at nearly the same time.
//
// Only ONE request can change:
//
// Pending -> Paid
//
// That same request is the ONLY request allowed to
// increase the campaign's raisedAmount.
// =====================================================

const finalizePaidDonation = async ({
  donationId,
  stripeSessionId,
  transactionId,
}) => {
  const updatedDonation = await Donation.findOneAndUpdate(
    {
      _id: donationId,
      paymentStatus: "Pending",
    },
    {
      $set: {
        paymentStatus: "Paid",
        stripeSessionId: stripeSessionId || "",
        transactionId: transactionId || "",
      },
    },
    {
      new: true,
    },
  );

  // ---------------------------------------------------
  // Nothing was updated.
  //
  // This means another request already processed the
  // donation, or the donation is no longer Pending.
  // ---------------------------------------------------

  if (!updatedDonation) {
    return {
      processed: false,
      donation: await Donation.findById(donationId),
    };
  }

  // ---------------------------------------------------
  // This request successfully changed Pending -> Paid.
  //
  // Therefore this request is the ONLY request that
  // should increase the campaign's raised amount.
  // ---------------------------------------------------

  await Campaign.findByIdAndUpdate(updatedDonation.campaign, {
    $inc: {
      raisedAmount: updatedDonation.amount,
    },
  });

  console.log("Donation finalized as Paid:", updatedDonation._id.toString());

  return {
    processed: true,
    donation: updatedDonation,
  };
};

// =====================================================
// CREATE DONATION
// =====================================================
//
// Kept for compatibility with the existing API.
//
// The frontend Stripe flow uses /checkout directly.
// =====================================================

const createDonation = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({
        message: "Campaign and amount are required.",
      });
    }

    const donationAmount = Number(amount);

    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({
        message: "Donation amount must be greater than zero.",
      });
    }

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: donationAmount,
      paymentStatus: "Pending",
      paymentMethod: "Stripe",
    });

    res.status(201).json({
      message: "Donation created successfully.",
      donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL DONATIONS
// =====================================================

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email role")
      .populate("campaign", "title targetAmount raisedAmount")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(donations);
  } catch (error) {
    console.error("Get all donations error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET MY DONATIONS
// =====================================================

const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user._id,
    })
      .populate(
        "campaign",
        "title description targetAmount raisedAmount disasterType location image",
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(donations);
  } catch (error) {
    console.error("Get my donations error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET DONATION RECEIPT
// =====================================================

const getDonationReceipt = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        message: "Stripe session ID is required.",
      });
    }

    // --------------------------------------------------
    // Retrieve the real Stripe Checkout Session
    // --------------------------------------------------

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Stripe payment session not found.",
      });
    }

    // --------------------------------------------------
    // Get donation ID from Stripe metadata
    // --------------------------------------------------

    const donationId = session.metadata?.donationId;

    if (!donationId) {
      return res.status(404).json({
        message: "Donation information was not found for this payment.",
      });
    }

    // --------------------------------------------------
    // Find donation
    // --------------------------------------------------

    let donation = await Donation.findById(donationId)
      .populate(
        "campaign",
        "title description targetAmount raisedAmount disasterType location",
      )
      .populate("donor", "name email");

    if (!donation) {
      return res.status(404).json({
        message: "Donation record not found.",
      });
    }

    // --------------------------------------------------
    // Security check
    // --------------------------------------------------

    if (
      !donation.donor ||
      donation.donor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this receipt.",
      });
    }

    // --------------------------------------------------
    // Make sure this Stripe session belongs to this
    // donation.
    // --------------------------------------------------

    if (donation.stripeSessionId && donation.stripeSessionId !== session.id) {
      return res.status(403).json({
        message: "Stripe session does not match this donation.",
      });
    }

    // --------------------------------------------------
    // Stripe says the payment is complete.
    //
    // Synchronize MongoDB if the webhook has not
    // processed it yet.
    //
    // finalizePaidDonation() guarantees that only one
    // request can increase raisedAmount.
    // --------------------------------------------------

    if (session.payment_status === "paid") {
      await finalizePaidDonation({
        donationId: donation._id,
        stripeSessionId: session.id,
        transactionId: session.payment_intent || "",
      });

      // Re-fetch so the receipt always contains the
      // latest payment state.
      donation = await Donation.findById(donationId)
        .populate(
          "campaign",
          "title description targetAmount raisedAmount disasterType location",
        )
        .populate("donor", "name email");
    }

    // --------------------------------------------------
    // Stripe session is not paid yet.
    // --------------------------------------------------

    if (session.payment_status !== "paid") {
      console.log("Stripe session is not paid yet:", session.payment_status);
    }

    // --------------------------------------------------
    // Return receipt
    // --------------------------------------------------

    res.status(200).json({
      receipt: {
        donationId: donation._id,

        transactionId: donation.transactionId || session.payment_intent || "",

        stripeSessionId: session.id,

        amount: donation.amount,

        paymentStatus: donation.paymentStatus,

        paymentMethod: donation.paymentMethod,

        createdAt: donation.createdAt,

        donor: {
          name: donation.donor?.name || "",
          email: donation.donor?.email || "",
        },

        campaign: donation.campaign
          ? {
              id: donation.campaign._id,

              title: donation.campaign.title,

              description: donation.campaign.description,

              disasterType: donation.campaign.disasterType,

              location: donation.campaign.location,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get donation receipt error:", error);

    if (error.type === "StripeInvalidRequestError") {
      return res.status(404).json({
        message: "Invalid or expired Stripe payment session.",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// CREATE STRIPE CHECKOUT SESSION
// =====================================================

const createCheckoutSession = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({
        message: "Campaign and amount are required.",
      });
    }

    const donationAmount = Number(amount);

    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({
        message: "Donation amount must be greater than zero.",
      });
    }

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    // --------------------------------------------------
    // Check campaign status
    // --------------------------------------------------

    if (campaign.status !== "Active") {
      return res.status(400).json({
        message: "This campaign is not currently accepting donations.",
      });
    }

    // --------------------------------------------------
    // Create pending donation
    // --------------------------------------------------

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: donationAmount,
      paymentStatus: "Pending",
      paymentMethod: "Stripe",
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        metadata: {
          donationId: donation._id.toString(),
          campaignId: campaign._id.toString(),
          donorId: req.user._id.toString(),
        },

        line_items: [
          {
            price_data: {
              // Keep the current Stripe currency used by
              // the project.
              currency: "usd",

              product_data: {
                name: campaign.title,

                description: campaign.description || "Disaster relief donation",
              },

              unit_amount: Math.round(donationAmount * 100),
            },

            quantity: 1,
          },
        ],

        mode: "payment",

        success_url:
          `${process.env.CLIENT_URL}` +
          `/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.CLIENT_URL}` +
          `/payment-cancel?session_id={CHECKOUT_SESSION_ID}`,
      });

      // ------------------------------------------------
      // Save Stripe session ID
      // ------------------------------------------------

      donation.stripeSessionId = session.id;

      await donation.save();

      res.status(200).json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (stripeError) {
      // Stripe Checkout creation failed, so the pending
      // donation should not remain active.
      donation.paymentStatus = "Failed";

      await donation.save();

      throw stripeError;
    }
  } catch (error) {
    console.error("Stripe checkout error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// CANCEL DONATION
// =====================================================

const cancelDonation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        message: "Stripe session ID is required.",
      });
    }

    // --------------------------------------------------
    // Retrieve Stripe session so we do not blindly mark
    // a paid session as failed.
    // --------------------------------------------------

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Stripe payment session not found.",
      });
    }

    // --------------------------------------------------
    // Find the donation belonging to the logged-in user
    // --------------------------------------------------

    const donation = await Donation.findOne({
      stripeSessionId: sessionId,
      donor: req.user._id,
    });

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found.",
      });
    }

    // --------------------------------------------------
    // Never change an already paid donation to Failed.
    // --------------------------------------------------

    if (
      donation.paymentStatus === "Paid" ||
      session.payment_status === "paid"
    ) {
      return res.status(200).json({
        message: "Donation has already been paid.",
        donation,
      });
    }

    // --------------------------------------------------
    // Only Pending donations can be cancelled.
    // --------------------------------------------------

    if (donation.paymentStatus === "Pending") {
      donation.paymentStatus = "Failed";

      await donation.save();
    }

    res.status(200).json({
      message: "Donation payment cancelled.",
      donation,
    });
  } catch (error) {
    console.error("Cancel donation error:", error);

    if (error.type === "StripeInvalidRequestError") {
      return res.status(404).json({
        message: "Invalid or expired Stripe payment session.",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// STRIPE WEBHOOK
// =====================================================

const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  // ---------------------------------------------------
  // Verify Stripe signature
  // ---------------------------------------------------

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook verification error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // =================================================
    // CHECKOUT COMPLETED
    // =================================================

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const donationId = session.metadata?.donationId;

      if (!donationId) {
        console.warn("Stripe checkout completed without donationId metadata.");

        return res.json({
          received: true,
        });
      }

      const donation = await Donation.findById(donationId);

      if (!donation) {
        console.warn("Donation not found for Stripe session:", session.id);

        return res.json({
          received: true,
        });
      }

      // ------------------------------------------------
      // Only finalize if Stripe confirms payment.
      //
      // For card Checkout this should normally be paid,
      // but checking payment_status protects the database
      // from treating an incomplete payment as successful.
      // ------------------------------------------------

      if (session.payment_status === "paid") {
        await finalizePaidDonation({
          donationId: donation._id,
          stripeSessionId: session.id,
          transactionId: session.payment_intent || "",
        });
      } else {
        console.log(
          "Checkout completed but payment is not marked paid:",
          session.payment_status,
        );
      }
    }

    // =================================================
    // EXPIRED CHECKOUT
    // =================================================

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      const donationId = session.metadata?.donationId;

      if (donationId) {
        const donation = await Donation.findOne({
          _id: donationId,
          paymentStatus: "Pending",
        });

        if (donation) {
          donation.paymentStatus = "Failed";

          await donation.save();

          console.log(
            "Expired Stripe donation marked Failed:",
            donation._id.toString(),
          );
        }
      }
    }

    // =================================================
    // ASYNC PAYMENT FAILED
    // =================================================

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;

      const donationId = session.metadata?.donationId;

      if (donationId) {
        const donation = await Donation.findOne({
          _id: donationId,
          paymentStatus: "Pending",
        });

        if (donation) {
          donation.paymentStatus = "Failed";

          await donation.save();

          console.log(
            "Async failed Stripe donation marked Failed:",
            donation._id.toString(),
          );
        }
      }
    }

    // =================================================
    // ASYNC PAYMENT SUCCEEDED
    // =================================================
    //
    // Included for completeness in case an asynchronous
    // payment method is enabled later.
    // =================================================

    if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;

      const donationId = session.metadata?.donationId;

      if (donationId) {
        await finalizePaidDonation({
          donationId,
          stripeSessionId: session.id,
          transactionId: session.payment_intent || "",
        });
      }
    }

    // --------------------------------------------------
    // Stripe received successfully
    // --------------------------------------------------

    res.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createDonation,
  getAllDonations,
  getMyDonations,
  getDonationReceipt,
  createCheckoutSession,
  cancelDonation,
  stripeWebhook,
};
