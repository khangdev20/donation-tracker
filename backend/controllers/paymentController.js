import Stripe from "stripe";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Transaction from "../models/Transaction.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {
    async createCheckoutSession(req, res) {
        const {
            amount,
            currency = "aud",
            fundingNeedId,
            isAnonymous,
        } = req.body;
        const user = req.user;
        try {
            const metadata = {
                fundingNeedId: fundingNeedId,
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                amount: amount,
                isAnonymous: isAnonymous,
                currency: currency,
            };

            const redirectUrl = `${process.env.CLIENT_URL}/fundraisers/${fundingNeedId}`;

            const checkoutSession = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency,
                            product_data: {
                                name: "Donation",
                                description: "Thank you for your support",
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                metadata: metadata,
                customer_email: user.email || undefined,
                success_url: redirectUrl,
                cancel_url: redirectUrl,
            });

            await Transaction.create({
                fundingNeedId: fundingNeedId,
                checkoutSessionId: checkoutSession.id,
                status: "pending",
                currency: currency,
                amount: amount,
            });

            res.status(200).json({
                success: true,
                message: "Checkout session created successfully",
                data: checkoutSession,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async webhookStripe(req, res) {
        let event = req.body;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (endpointSecret) {
            const signature = req.headers["stripe-signature"];
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    endpointSecret
                );
            } catch (err) {
                console.log(
                    `⚠️  Webhook signature verification failed.`,
                    err.message
                );
                return res.sendStatus(400);
            }

            switch (event.type) {
                case "checkout.session.completed":
                    const session = event.data.object;
                    const amount = session.amount_total / 100;
                    const metadata = session.metadata;
                    const fundingNeedId = metadata.fundingNeedId;
                    const checkoutSessionId = session.id;
                    const isAnonymous = metadata.isAnonymous;
                    const userId = metadata.userId;
                    const name = metadata.name;
                    const email = metadata.email;
                    const currency = metadata.currency;

                    console.log(amount);

                    const fundingNeed = await Campaign.findById(fundingNeedId);
                    fundingNeed.currentAmount += amount;
                    fundingNeed.backers += 1;
                    if (fundingNeed.currentAmount >= fundingNeed.goalAmount) {
                        fundingNeed.status = "completed";
                    }
                    if (fundingNeed.currentAmount < fundingNeed.goalAmount) {
                        fundingNeed.status = "active";
                    }
                    await fundingNeed.save();

                    const transaction = await Transaction.findOneAndUpdate(
                        { checkoutSessionId: checkoutSessionId },
                        { status: "completed", amount: amount }
                    );

                    await Donation.create({
                        fundingNeedId: fundingNeedId,
                        userId: userId,
                        name: name,
                        email: email,
                        amount: amount,
                        currency: currency,
                        transactionId: transaction._id,
                        isAnonymous: isAnonymous,
                    });

                    break;

                case "payment_intent.succeeded":
                    const intent = event.data.object;
                    const amountPI = intent.amount_received;
                    break;

                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            // Return a response to acknowledge receipt of the event
            res.json({ received: true });
        }
    }
}

export default new PaymentController();
