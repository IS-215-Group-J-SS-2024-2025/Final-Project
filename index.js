// ProcessImage/index.js
const AWS = require('aws-sdk');
const https = require('https');

const s3 = new AWS.S3();
const rekog = new AWS.Rekognition();

exports.handler = async (event) => {
  console.log("▶ Incoming event:", JSON.stringify(event));

  try {
    // ─── 1) Figure out the S3 key ────────────────────────────
    let key;
    if (event.body) {
      // API Gateway invocation
      let payload = typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body;
      key = payload.key;
    } else if (event.Records?.[0]?.s3?.object?.key) {
      // S3 trigger invocation
      key = event.Records[0].s3.object.key;
    }
    if (!key) throw new Error("No S3 key found in event");

    console.log("• Using key:", key);
    const bucket = 'groupj-is215-image-uploads';

    // ─── 2) Download the image ─────────────────────────────────
    const getObj = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    console.log(`• Fetched ${getObj.ContentLength} bytes from S3`);

    // ─── 3) Rekognition ───────────────────────────────────────
    const rek = await rekog.detectLabels({
      Image: { Bytes: getObj.Body },
      MaxLabels: 10
    }).promise();
    const labels = rek.Labels.map(l => `${l.Name}(${l.Confidence.toFixed(1)}%)`).join(', ');
    console.log("• Rekognition labels:", labels);

    // ─── 4) Call ChatGPT ──────────────────────────────────────
    const chatPayload = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Write a descriptive article about an image containing: ${labels}.` }
      ]
    });
    console.log("• Sending to ChatGPT:", chatPayload);

    const chatResp = await new Promise((res, rej) => {
      const url = new URL(process.env.CHATGPT_ENDPOINT);
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CHATGPT_API_KEY}`
        }
      }, r => {
        let body = "";
        r.on("data", d => (body += d));
        r.on("end", () => {
          console.log("• ChatGPT raw response:", body);
          res(JSON.parse(body));
        });
      });
      req.on("error", rej);
      req.write(chatPayload);
      req.end();
    });
    const article = chatResp.choices[0].message.content;
    console.log("• Article received (first 200 chars):", article.slice(0, 200));

    // ─── 5) Save article to S3 ────────────────────────────────
    const txtKey = key
      .replace(/^uploads\//, "articles/")
      .replace(/\.[^/.]+$/, ".txt");
    await s3.putObject({
      Bucket: bucket,
      Key: txtKey,
      Body: article,
      ContentType: "text/plain"
    }).promise();
    console.log("• Article saved to:", txtKey);

    // ─── 6) Create signed GET URL ─────────────────────────────
    const articleUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: bucket,
      Key: txtKey,
      Expires: 300
    });
    console.log("• Signed GET URL:", articleUrl);

    // ─── 7) Return result ─────────────────────────────────────
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ articleUrl })
    };

  } catch (err) {
    console.error("❌ Handler error:", err);
    return {
      statusCode: err.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: err.message, stack: err.stack })
    };
  }
};
