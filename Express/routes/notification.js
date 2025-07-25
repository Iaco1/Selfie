const admin = require("firebase-admin");
const express = require('express');
const router = express.Router();
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'selfie-a0bd3'
});

// Function to send notification
async function sendNotification(token, title, body) {
  try {
    const message = {
      notification: {
        title,
        body
      },
      token
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

router.post('/', async (req, res) => {
  try{
    const message =  await sendNotification(req.body.FCMtoken, req.body.title, req.body.body);
    res.json({
      status: 200,
      message: message
    })
  }catch (err){
    console.log("notification post failed: ", err);
    res.json({
      status: 500,
      message: `notification post failed: ${err}`
    })
  }
})

module.exports = router;