const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const stripe = require("../config/stripe");

// =====================================================
// DONATION CURRENCY
// =====================================================
//
// The application uses Bangladeshi Taka (BDT).
//
// Stripe expects BDT amounts in the minor unit.
//
// Example:
// ৳1,000 = 100000 poisha
//
// =====================================================

const DONATION_CURRENCY = (process.env.STRIPE_CURRENCY || "bdt").toLowerCase();

// =====================================================
// DONATION LIMITS
// =====================================================

const MIN_DONATION_AMOUNT = 100;
const MAX_DONATION_AMOUNT = 100000;

// =====================================================
// FINALIZE PAID DONATION
// =====================================================
//
// Only one request is allowed to change:
//
// Pending -> Paid
//
// That request is also the only request allowed to
// increase campaign.raisedAmount.
//
// This prevents duplicate Stripe webhook processing
// from increasing the campaign total more than once.
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

  // Already processed.
  if (!updatedDonation) {
    return {
      processed: false,
      donation: await Donation.findById(donationId),
    };
  }

  // Only Pending -> Paid reaches here.
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
// Stripe frontend flow uses /checkout directly.
// =====================================================

const createDonation = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || amount === undefined) {
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

    if (donationAmount < MIN_DONATION_AMOUNT) {
      return res.status(400).json({
        message: `Minimum donation amount is ৳${MIN_DONATION_AMOUNT.toLocaleString("en-BD")}.`,
      });
    }

    if (donationAmount > MAX_DONATION_AMOUNT) {
      return res.status(400).json({
        message: `Maximum donation amount is ৳${MAX_DONATION_AMOUNT.toLocaleString("en-BD")}.`,
      });
    }

    if (!Number.isInteger(donationAmount)) {
      return res.status(400).json({
        message: "Donation amount must be a whole number of BDT.",
      });
    }

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    if (campaign.status !== "Active") {
      return res.status(400).json({
        message: "This campaign is not currently accepting donations.",
      });
    }

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: donationAmount,
      paymentStatus: "Pending",
      paymentMethod: "Stripe",
    });

    return res.status(201).json({
      message: "Donation created successfully.",
      donation,
      currency: DONATION_CURRENCY.toUpperCase(),
    });
  } catch (error) {
    console.error("Create donation error:", error);

    return res.status(500).json({
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

    return res.status(200).json(donations);
  } catch (error) {
    console.error("Get all donations error:", error);

    return res.status(500).json({
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

    return res.status(200).json(donations);
  } catch (error) {
    console.error("Get my donations error:", error);

    return res.status(500).json({
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
    // Retrieve Stripe Checkout Session
    // --------------------------------------------------

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Stripe payment session not found.",
      });
    }

    // --------------------------------------------------
    // Get donation ID from metadata
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
    // Security: receipt belongs to logged-in user
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
    // Security: Stripe session must match donation
    // --------------------------------------------------

    if (donation.stripeSessionId && donation.stripeSessionId !== session.id) {
      return res.status(403).json({
        message: "Stripe session does not match this donation.",
      });
    }

    // --------------------------------------------------
    // Verify currency
    // --------------------------------------------------

    if (
      session.currency &&
      session.currency.toLowerCase() !== DONATION_CURRENCY
    ) {
      return res.status(400).json({
        message:
          "Stripe payment currency does not match the application's donation currency.",
      });
    }

    // --------------------------------------------------
    // Synchronize paid payment
    // --------------------------------------------------

    if (session.payment_status === "paid") {
      await finalizePaidDonation({
        donationId: donation._id,
        stripeSessionId: session.id,
        transactionId: session.payment_intent || "",
      });

      donation = await Donation.findById(donationId)
        .populate(
          "campaign",
          "title description targetAmount raisedAmount disasterType location",
        )
        .populate("donor", "name email");
    }

    // --------------------------------------------------
    // Return receipt
    // --------------------------------------------------

    return res.status(200).json({
      receipt: {
        donationId: donation._id,

        transactionId: donation.transactionId || session.payment_intent || "",

        stripeSessionId: session.id,

        amount: donation.amount,

        currency: DONATION_CURRENCY.toUpperCase(),

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

    return res.status(500).json({
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

    if (!campaignId || amount === undefined) {
      return res.status(400).json({
        message: "Campaign and amount are required.",
      });
    }

    const donationAmount = Number(amount);

    // ------------------------------------------------
    // Validate amount
    // ------------------------------------------------

    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({
        message: "Donation amount must be greater than zero.",
      });
    }

    if (donationAmount < MIN_DONATION_AMOUNT) {
      return res.status(400).json({
        message: `Minimum donation amount is ৳${MIN_DONATION_AMOUNT.toLocaleString("en-BD")}.`,
      });
    }

    if (donationAmount > MAX_DONATION_AMOUNT) {
      return res.status(400).json({
        message: `Maximum donation amount is ৳${MAX_DONATION_AMOUNT.toLocaleString("en-BD")}.`,
      });
    }

    if (!Number.isInteger(donationAmount)) {
      return res.status(400).json({
        message: "Donation amount must be a whole number of BDT.",
      });
    }

    const normalizedAmount = Math.round(donationAmount * 100) / 100;

    // ------------------------------------------------
    // Find campaign
    // ------------------------------------------------

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    // ------------------------------------------------
    // Campaign status
    // ------------------------------------------------

    if (campaign.status !== "Active") {
      return res.status(400).json({
        message: "This campaign is not currently accepting donations.",
      });
    }

    // ------------------------------------------------
    // Create pending donation
    // ------------------------------------------------

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: normalizedAmount,
      paymentStatus: "Pending",
      paymentMethod: "Stripe",
    });

    try {
      // ------------------------------------------------
      // Stripe Checkout
      //
      // Example:
      //
      // Application amount = ৳1,000
      // Stripe amount = 100000 poisha
      // ------------------------------------------------

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        metadata: {
          donationId: donation._id.toString(),

          campaignId: campaign._id.toString(),

          donorId: req.user._id.toString(),

          currency: DONATION_CURRENCY,
        },

        line_items: [
          {
            price_data: {
              currency: DONATION_CURRENCY,

              product_data: {
                name: campaign.title,

                description: campaign.description || "Disaster relief donation",
              },

              unit_amount: Math.round(normalizedAmount * 100),
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

      return res.status(200).json({
        url: session.url,

        sessionId: session.id,

        currency: DONATION_CURRENCY.toUpperCase(),

        amount: normalizedAmount,
      });
    } catch (stripeError) {
      donation.paymentStatus = "Failed";

      await donation.save();

      throw stripeError;
    }
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
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

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Stripe payment session not found.",
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

    // --------------------------------------------------
    // Never change an already paid donation
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
    // Only Pending donations can be cancelled
    // --------------------------------------------------

    if (donation.paymentStatus === "Pending") {
      donation.paymentStatus = "Failed";

      await donation.save();
    }

    return res.status(200).json({
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

    return res.status(500).json({
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
      // Currency validation
      // ------------------------------------------------

      if (
        session.currency &&
        session.currency.toLowerCase() !== DONATION_CURRENCY
      ) {
        console.error(
          "Stripe currency mismatch:",
          session.currency,
          "expected:",
          DONATION_CURRENCY,
        );

        return res.json({
          received: true,
        });
      }

      // ------------------------------------------------
      // Amount validation
      // ------------------------------------------------

      const expectedStripeAmount = Math.round(donation.amount * 100);

      if (
        session.amount_total !== null &&
        Number(session.amount_total) !== expectedStripeAmount
      ) {
        console.error("Stripe amount mismatch:", {
          donationId: donation._id.toString(),

          expected: expectedStripeAmount,

          received: session.amount_total,
        });

        return res.json({
          received: true,
        });
      }

      // ------------------------------------------------
      // Campaign validation
      // ------------------------------------------------

      if (
        session.metadata?.campaignId &&
        String(session.metadata.campaignId) !== String(donation.campaign)
      ) {
        console.error("Stripe campaign mismatch:", donation._id.toString());

        return res.json({
          received: true,
        });
      }

      // ------------------------------------------------
      // Donor validation
      // ------------------------------------------------

      if (
        session.metadata?.donorId &&
        String(session.metadata.donorId) !== String(donation.donor)
      ) {
        console.error("Stripe donor mismatch:", donation._id.toString());

        return res.json({
          received: true,
        });
      }

      // ------------------------------------------------
      // Finalize only if paid
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

    if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;

      const donationId = session.metadata?.donationId;

      if (donationId) {
        const donation = await Donation.findById(donationId);

        if (donation) {
          const expectedAmount = Math.round(donation.amount * 100);

          const currencyMatches =
            !session.currency ||
            session.currency.toLowerCase() === DONATION_CURRENCY;

          const amountMatches =
            session.amount_total === null ||
            Number(session.amount_total) === expectedAmount;

          const campaignMatches =
            !session.metadata?.campaignId ||
            String(session.metadata.campaignId) === String(donation.campaign);

          const donorMatches =
            !session.metadata?.donorId ||
            String(session.metadata.donorId) === String(donation.donor);

          if (
            currencyMatches &&
            amountMatches &&
            campaignMatches &&
            donorMatches
          ) {
            await finalizePaidDonation({
              donationId,

              stripeSessionId: session.id,

              transactionId: session.payment_intent || "",
            });
          } else {
            console.error(
              "Stripe async payment validation failed:",
              donationId,
            );
          }
        }
      }
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return res.status(500).json({
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
