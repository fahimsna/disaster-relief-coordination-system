const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const stripe = require("../config/stripe");

// =====================================================
// CREATE DONATION
// =====================================================

const createDonation = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({
        message: "Campaign and amount are required.",
      });
    }

    if (Number(amount) <= 0) {
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
      amount: Number(amount),
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
      .sort({ createdAt: -1 });

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
      .sort({ createdAt: -1 });

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
    // Retrieve the REAL Stripe Checkout Session
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

    const donation = await Donation.findById(donationId)
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

    if (donation.donor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this receipt.",
      });
    }

    // ==================================================
    // IMPORTANT FIX
    // ==================================================
    //
    // Stripe says the payment is complete even if our
    // webhook has not updated MongoDB yet.
    //
    // Therefore synchronize the Donation here.
    // ==================================================

    if (
      session.payment_status === "paid" &&
      donation.paymentStatus !== "Paid"
    ) {
      donation.paymentStatus = "Paid";

      donation.stripeSessionId = session.id;

      donation.transactionId = session.payment_intent || "";

      await donation.save();

      console.log(
        "Donation synchronized as Paid from Stripe:",
        donation._id.toString(),
      );

      // ------------------------------------------------
      // IMPORTANT:
      // Only increase campaign raisedAmount if the
      // donation has never already been processed.
      //
      // If the webhook already processed it, the status
      // would already be Paid and this block would not
      // execute.
      // ------------------------------------------------

      await Campaign.findByIdAndUpdate(donation.campaign._id, {
        $inc: {
          raisedAmount: donation.amount,
        },
      });
    }

    // --------------------------------------------------
    // If Stripe says unpaid, keep Pending.
    // --------------------------------------------------

    if (
      session.payment_status !== "paid" &&
      donation.paymentStatus === "Pending"
    ) {
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

    if (Number(amount) <= 0) {
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
    // Create pending donation
    // --------------------------------------------------

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: Number(amount),
      paymentStatus: "Pending",
      paymentMethod: "Stripe",
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        metadata: {
          donationId: donation._id.toString(),
        },

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name: campaign.title,

                description: campaign.description || "Disaster relief donation",
              },

              unit_amount: Math.round(Number(amount) * 100),
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

      donation.stripeSessionId = session.id;

      await donation.save();

      res.status(200).json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (stripeError) {
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

    const donation = await Donation.findOne({
      stripeSessionId: sessionId,
      donor: req.user._id,
    });

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found.",
      });
    }

    if (donation.paymentStatus === "Paid") {
      return res.status(200).json({
        message: "Donation has already been paid.",
        donation,
      });
    }

    donation.paymentStatus = "Failed";

    await donation.save();

    res.status(200).json({
      message: "Donation payment cancelled.",
      donation,
    });
  } catch (error) {
    console.error("Cancel donation error:", error);

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

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook verification error:", err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // =================================================
    // CHECKOUT COMPLETED
    // =================================================

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const donationId = session.metadata?.donationId;

      if (!donationId) {
        return res.json({
          received: true,
        });
      }

      const donation = await Donation.findById(donationId);

      if (!donation) {
        return res.json({
          received: true,
        });
      }

      // Only process once.
      if (donation.paymentStatus !== "Paid") {
        donation.paymentStatus = "Paid";

        donation.stripeSessionId = session.id;

        donation.transactionId = session.payment_intent || "";

        await donation.save();

        await Campaign.findByIdAndUpdate(donation.campaign, {
          $inc: {
            raisedAmount: donation.amount,
          },
        });

        console.log(
          "Donation marked Paid by webhook:",
          donation._id.toString(),
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
        const donation = await Donation.findById(donationId);

        if (donation && donation.paymentStatus === "Pending") {
          donation.paymentStatus = "Failed";

          await donation.save();
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
        const donation = await Donation.findById(donationId);

        if (donation && donation.paymentStatus === "Pending") {
          donation.paymentStatus = "Failed";

          await donation.save();
        }
      }
    }

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
