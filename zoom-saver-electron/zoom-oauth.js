// zoom-oauth.js
import express from "express";
import fetch from "node-fetch";

const app = express();

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/zoom/callback"; // must match your Zoom app settings

// Step 1: Link to Zoom OAuth authorize URL
app.get("/auth/zoom", (req, res) => {
  const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}`;
  res.redirect(authUrl);
});

// Step 2: Zoom redirects here with ?code=XYZ
app.get("/auth/zoom/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code returned from Zoom");
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokens = await tokenRes.json();
    console.log("Zoom OAuth Tokens:", tokens);

    // tokens = { access_token, refresh_token, expires_in, token_type, scope }

    // You should store these securely (DB, encrypted store)
    res.send("Zoom authorization successful! You can close this window.");
  } catch (err) {
    console.error("Error exchanging code for tokens:", err);
    res.status(500).send("Zoom OAuth failed");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
