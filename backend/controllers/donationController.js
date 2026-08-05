const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const stripe = require("../config/stripe");

// @desc Create Donation
// @route POST /api/donations
// @access Protected
const createDonation = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({
        message: "Campaign and amount are required.",
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
      amount,
      paymentStatus: "Pending",
    });

    res.status(201).json({
      message: "Donation created successfully.",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get all donations
// @route GET /api/donations
// @access Protected (Admin)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email role")
      .populate("campaign", "title targetAmount raisedAmount");

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get logged-in user's donations
// @route GET /api/donations/my
// @access Protected
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user._id,
    })
      .populate("campaign", "title targetAmount raisedAmount")
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Create Stripe Checkout Session
// @route POST /api/donations/checkout
// @access Protected
const createCheckoutSession = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    // Create pending donation
    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount,
      paymentStatus: "Pending",
      paymentMethod: "Stripe",
    });

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
              description: campaign.description,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Stripe Webhook
// @route POST /api/donations/webhook
// @access Public
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
    console.log(err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const donationId = session.metadata?.donationId;

    if (!donationId) {
      console.log("No donation ID found in Stripe metadata");
      return res.json({ received: true });
    }

    const donation = await Donation.findById(donationId);

    if (donation && donation.paymentStatus !== "Paid") {
      donation.paymentStatus = "Paid";
      donation.transactionId = session.payment_intent;

      await donation.save();

      await Campaign.findByIdAndUpdate(donation.campaign, {
        $inc: {
          raisedAmount: donation.amount,
        },
      });

      console.log("Donation marked as Paid");
    }
  }

  res.json({
    received: true,
  });
};

module.exports = {
  createDonation,
  getAllDonations,
  getMyDonations,
  createCheckoutSession,
  stripeWebhook,
};
