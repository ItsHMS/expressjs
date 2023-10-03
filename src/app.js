import express from "express";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";

const app = express();
const pendingRequests = {};

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});
app.post("/xyz",(req,res)=>{
  res.status(200).send(req.body)
})

app.use("/hello", helloRoute);



app.post("/webhook-callback", (req, res) => {
  console.log("Received webhook callback:", req.body);
  const requestId = req.query.callback_id; // Assuming the external API sends back the reference ID

  if (pendingRequests[requestId]) {
    pendingRequests[requestId].json(req.body); // Respond to the original request from the Vue app
    console.log("pendind fulfiled", pendingRequests);
    delete pendingRequests[requestId]; // Cleanup
  }

  res.sendStatus(200);
});

app.post("/generate-image", async (req, res) => {
  let prompt = req.body?.prompt;
  console.log(prompt);

  // --------------: actual api :-----------
  const requestId = new Date().getTime().toString();
  pendingRequests[requestId] = res; // Store the response object directly

  const apiUrl = "https://app.graydient.ai/api/v3/render/";
  const bearerToken = "dajgJq90RXnjPZeQW3-spzNIp4faGYMITe-tRP4PUxK4yYNS";
  const requestBody = {
    prompt: prompt,
    callback_url: `https://expressjs-production-dde2.up.railway.app?callback_id=${requestId}`, // Adjusted callback URL to include requestId
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    // No need to send a response here. It'll be sent once the webhook is called.
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to fetch from Graydient API");
  }
});

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
