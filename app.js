const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51OSFPgSE08OvuMJOh5taSmuvF6V12NoGx3LgjvVLo6f1ErRWpBZrNVUWqpPZmXdWolwUx5pAi7TaBPMDW054OVDp00lGam2lF3");

app.use(express.json());
app.use(cors());

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { product, customerName, customerAddress } = req.body;
        console.log(product)
    // Ensure that `product` is an array
    if (!Array.isArray(product) || product.length === 0) {
      throw new Error("Invalid or empty product array.");
    }
   const lineItems = product.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name
        },
        unit_amount: (product.price*10) *(product.date*1 )*(product.guest*1)  ,
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: "customer@example.com", // Replace with actual customer email
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "IN"], // Specify allowed non-Indian countries for shipping
      },
      billing_address_collection: "required", // Collect billing address information
      success_url: "http://localhost:5173",
      cancel_url: "http://localhost:5173/cancel"
    });

    console.log("Session created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(7000, () => {
  console.log("Server started on port 7000");
});
