const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/auth', (req, res) => {
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
  const authUrl = `https://id.vk.com/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&state=test_state`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Код авторизации не получен');
  }

  try {
    const response = await axios.post('https://api.vk.com/method/auth.exchangeCode', null, {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code,
        v: '5.199'
      }
    });

    if (response.data.error) {
      console.log('Ошибка обмена:', response.data.error);
      return res.status(400).send('Ошибка авторизации');
    }

    res.send(`Успешно! Токен: ${JSON.stringify(response.data.response)}`);
  } catch (error) {
    console.error('Ошибка при обмене токена:', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
