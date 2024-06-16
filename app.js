const {

    GoogleGenerativeAI,
  
    HarmCategory,
  
    HarmBlockThreshold,
  
  } = require("@google/generative-ai");
  
  const dialogflow = require("@google-cloud/dialogflow");
  
  const { WebhookClient, Payload } = require("dialogflow-fulfillment");
  
  const express = require("express");
  
  const nodemailer = require("nodemailer");
  
  const MODEL_NAME = "gemini-1.5-pro";
  
  const API_KEY = "AIzaSyBxJHIpZoF1AYOts7oX-KFQE7Rcbvq3pVY";
  
  
  
  
  async function runChat(queryText) {
  
    const genAI = new GoogleGenerativeAI(
  
      "AIzaSyBxJHIpZoF1AYOts7oX-KFQE7Rcbvq3pVY"
  
    );
  
    console.log(genAI);
  
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
  
  
  
    const generationConfig = {
  
      temperature: 1,
  
      top_p: 0.95,
  
      top_k: 64,
  
      max_output_tokens: 60,
  
      response_mime_type: "text/plain",
  
    };
  
  
  
  
    const chat = model.startChat({
  
      generationConfig,
  
      history: [],
  
    });
  
  
  
  
    const result = await chat.sendMessage(queryText);
  
    const response = result.response;
  
    return response.text();
  
  }
  
  
  
  
  const webApp = express();
  
  const PORT = process.env.PORT || 5550;
  
  webApp.use(
  
    express.urlencoded({
  
      extended: true,
  
    })
  
  );
  
  webApp.use(express.json());
  
  webApp.use((req, res, next) => {
  
    console.log(`Path ${req.path} with Method ${req.method}`);
  
    next();
  
  });
  
  
  
  
  // webApp.get;
  
  
  
  
  webApp.get("/", (req, res) => {
  
    res.sendStatus(200);
  
    res.send("Status Okay");
  
  });
  
  
  
  
  webApp.post("/dialogflow", async (req, res) => {
  
    var id = res.req.body.session.substr(43);
  
    console.log(id);
  
    const agent = new WebhookClient({
  
      request: req,
  
      response: res,
  
    });
  
  
  
  
    function welcome(agent) {
  
      console.log(`intent  =>  Default Welcome Intent`);
  
      agent.add("Hello! Welcome to Lasani Cattle Farm, How can I help you?.");
  
    }
  
  
  
  
    function CowPurchase(agent) {
  
      const { name, CowType, budget, age, color, email, address } =
  
        agent.parameters;
  
      console.log(`intent  =>  Cow-Purchase - yes`);
  
  
  
  
      const accountSid = "AC4dcacf54f528a27d05a84b450ba99872";
  
      const authToken = "Your Auth Token Here";
  
      const client = require("twilio")(accountSid, authToken);
  
  
  
  
      agent.add("We have received all your details, please check your email");
  
  
  
  
      client.messages
  
        .create({
  
          body: `Dear ${name},
  
  
  
  
              Your order for a ${CowType} is confirmed. Your Budget is Rs. ${budget} PKR for a ${age} animal in ${color} color. We will deliver it to your specified location: ${address}. This is your confirmation Email at ${email}.`,
  
          from: "+14795527234",
  
          to: "+923211555007",
  
        })
  
        .then((message) => console.log(message.sid));
  
  
  
  
      var transporter = nodemailer.createTransport({
  
        service: "gmail",
  
        auth: {
  
          user: "a.hannan91@gmail.com", // <-- Your Email Here
  
          pass: "bqgnqtsqzlrawpev", // <-- Your Pass key here
  
        },
  
      });
  
  
  
  
      var mailOptions = {
  
        from: "afnanalikhan982@gmail.com",
  
        to: email,
  
        cc: "hammadn788@gmail.com",
  
        subject: "Thank you for your purchase at Lasani Farm",
  
        html: `
  
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  
                     <img src="https://firebasestorage.googleapis.com/v0/b/image-icons.appspot.com/o/Lasani%20Logo.png?alt=media&token=963f0f09-e286-422a-890b-f7de49704218" alt="Saylani Logo" style="width: 100px; height: auto; display: block; margin: 20px auto;">
     
  
                    <h2 style="text-align: center; color: #4CAF50;">Thank You for Your purchase at Lasani Farm</h2>
  
                        <p>Dear ${name},</p>
  
                        <p>We have received your details as follows:</p>
  
                        <div style="border: 1px solid #dcdcdc; padding: 15px; border-radius: 10px; background-color: #f9f9f9;">
  
                              <p><strong>Email:</strong> ${email}</p>
  
                              <p><strong>Cow Type:</strong> ${CowType}</p>
  
                              <p><strong>Your Budget:</strong> ${budget}</p>
  
                              <p><strong>Age:</strong> ${age}</p>
  
                              <p><strong>Color:</strong> ${color}</p>
  
                              <p><strong>Delivery Address:</strong> ${address}</p>
  
                        </div>
  
                        <p>Thank you for your purchase at Lasani Farm.</p>
  
                        <p>Best regards,</p>
  
                        <p>Lasani Farm <br> Online Department</p> <br>
  
                        <span style="colors:gray">This Email is Powered by Abdul Hannan</span>
  
                    </div>
  
            `,
  
      };
  
      //   text: `Hello Dear ${name}! We have received your details with your city ${city}, your age ${age}, your CNIC No. ${CNICnumber} email ${email}, your contact number ${phone} and your address ${address}. Thank you for your registration at SMIT.`,
  
      // };
  
  
  
  
      transporter.sendMail(mailOptions, function (error, info) {
  
        if (error) {
  
          console.log(error);
  
        } else {
  
          console.log("Email sent: " + info.response);
  
        }
  
      });
  
    }
  
  
  
  
    async function Fallback() {
  
      let action = req.body.queryResult.action;
  
      let queryText = req.body.queryResult.queryText;
  
  
  
  
      if (action === "input.unknown") {
  
        let result = await runChat(queryText);
  
        agent.add(result);
  
        console.log(result);
  
      } else {
  
        agent.add(result);
  
        console.log(result);
  
      }
  
    }
  
  
  
  
    let intentMap = new Map();
  
    intentMap.set("Default Welcome Intent", welcome);
  
    intentMap.set("Cow-Purchase - yes", CowPurchase);
  
    intentMap.set("Default Fallback Intent", Fallback);
  
    agent.handleRequest(intentMap);
  
  });
  
  
  
  
  webApp.listen(PORT, () => {
  
    console.log(`Server is up and running at http://localhost:${PORT}/`);
  
  });