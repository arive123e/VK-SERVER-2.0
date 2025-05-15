const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const CLIENT_ID = process.env.VK_CLIENT_ID;
const CLIENT_SECRET = process.env.VK_CLIENT_SECRET;
const REDIRECT_URI = process.env.VK_REDIRECT_URI;

app.get('/', (req, res) => {
  res.send(`
    <h1>Войти через VK ID</h1>
    <a href="https://id.vk.com/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=your_state_value">Войти</a>
  `);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send('Код авторизации не получен.');

  try {
    const tokenResponse = await axios.post('https://api.vk.com/method/auth.exchangeCode', null, {
      params: {
        v: '5.199',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code
      }
    });

    res.send(`<pre>${JSON.stringify(tokenResponse.data, null, 2)}</pre>`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Ошибка обмена кода на токен.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
