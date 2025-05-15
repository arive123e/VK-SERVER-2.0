const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

app.get("/", (req, res) => {
  res.send(`<h1>VK ID Авторизация</h1><a href="/auth">Войти через VK ID</a>`);
});

app.get("/auth", (req, res) => {
  const redirectUri = encodeURIComponent("https://vk-server-2-0.onrender.com/callback");
  const authUrl = `https://id.vk.com/auth?client_id=${process.env.VK_APP_ID}&redirect_uri=${redirectUri}&response_type=code&state=test_state`;
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("Код не получен");

  try {
    const { data } = await axios.get("https://api.vk.com/method/oauth.access_token", {
      params: {
        client_id: process.env.VK_APP_ID,
        client_secret: process.env.VK_APP_SECRET,
        redirect_uri: "https://vk-server-2-0.onrender.com/callback",
        code,
        v: "5.199"
      }
    });
    const resp = data.response || data;
    res.send(`<h1>Добро пожаловать, user_id: ${resp.user_id}</h1>`);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.send("Ошибка при получении токена");
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
