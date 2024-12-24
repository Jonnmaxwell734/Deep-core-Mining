const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config(); // Load environment variables for security

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// FaucetPay API Details (Replace with your credentials)
const FAUCETPAY_API_URL = "https://faucetpay.io/api/v1/payout";
const FAUCETPAY_API_KEY = process.env.FAUCETPAY_API_KEY; // Use .env to store API keys

// Endpoint to Handle Withdrawals
app.post("/withdraw", async (req, res) => {
    const { faucetPayAddress, amount, currency } = req.body;

    // Validate Inputs
    if (!faucetPayAddress || !amount || !currency) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Make API Request to FaucetPay
        const response = await axios.post(FAUCETPAY_API_URL, {
            api_key: FAUCETPAY_API_KEY,
            to: faucetPayAddress,
            amount: amount,
            currency: currency,
        });

        // Check Response from FaucetPay
        if (response.data.success) {
            return res.status(200).json({
                message: "Payout successful",
                data: response.data,
            });
        } else {
            return res.status(400).json({
                error: "FaucetPay API Error",
                details: response.data,
            });
        }
    } catch (error) {
        console.error("Error during FaucetPay API request:", error.message);
        return res.status(500).json({
            error: "Server error while processing payout",
        });
    }
});

app.get("/", (req, res) => {
    res.send(`
        <h1>FaucetPay Withdrawal</h1>
        <form action="/withdraw" method="POST" style="display: flex; flex-direction: column; width: 300px;">
            <input type="text" name="faucetPayAddress" placeholder="FaucetPay Address" required />
            <input type="number" step="0.0001" name="amount" placeholder="Amount (e.g., 0.001)" required />
            <select name="currency" required>
                <option value="BTC">Bitcoin</option>
                <option value="ETH">Ethereum</option>
                <option value="LTC">Litecoin</option>
                <option value="DOGE">Dogecoin</option>
                <option value="TRX">Tron</option>
            </select>
            <button type="submit">Withdraw</button>
        </form>
    `);
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});