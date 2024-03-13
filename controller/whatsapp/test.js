const API_KEY = process.env.MSG_API_KEY;
const CLIENT_ID = process.env.MSG_CLIENT_ID;

async function sendTextMessage(number, message) {
  const url = "https://msgmagnet.com/api/user/v2/send_message"; // Replace with your domain endpoint

  const body = {
    client_id: CLIENT_ID, // Client ID here
    mobile: `${number}`,
    text: message,
  };

  const token = API_KEY; // Your API keys here

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Failed to send whatsapp message");
      return { message: "Failed to send message" };
    }

    const data = await response.json();
    console.log(data); // Handle the response data as per your requirements

    return data;
  } catch (error) {
    console.error(error);
  }
}

// Template action
async function sendTextMessageActionTemplate(number, mobile) {
  const url = "https://msgmagnet.com/api/user/v2/send_templet";

  const body = {
    client_id: CLIENT_ID,
    mobile: `${number}`,
    templet_id: 39,
  };

  const token = API_KEY;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log(response.statusText);
      console.error("Failed to send whatsapp message");
      return { message: "Failed to send message" };
    }

    const data = await response.json();
    console.log(data); // Handle the response data as per your requirements
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function testWhatsapp(req, res) {
  const { number, message } = req.body;
  const data = await sendTextMessageActionTemplate(number, message);
  res.json(data);
}

module.exports = testWhatsapp;
