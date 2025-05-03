**GroupJ AWS Rekog + Article Generation Using Serverless Microservices Architecture**

This repository contains a simple Node.js–based static front-end that lets users upload images and receive AI‑generated descriptive articles via an AWS Serverless backend (API Gateway + Lambda + S3).

---

## 🚀 Project Overview

* **Front‑end**: A static HTML page (`index.html`) served via Node.js (or any static host) that provides an image picker and displays the resulting article, located in the `feature/frontend-ui` branch under the root of that branch.
* **Backend**: AWS API Gateway exposes two endpoints:

  1. `/process-image` — accepts image uploads via PUT to S3 `images/` folder, triggers a Lambda function that:

     * Uses Amazon Rekognition to detect labels
     * Calls ChatGPT to generate an article
     * Saves the article as `.txt` in S3 `articles/` folder
  2. `/sign-upload` — provides pre‑signed URLs for secure image upload (optional helper service).

## 📂 Folder Structure

> ⚠️ This layout reflects the `feature/frontend-ui` branch.

```
feature/frontend-ui/
├─ index.html         # Static front‑end HTML + JS
├─ package.json       # Node.js metadata (if using a local server)
└─ README.md          # Project documentation
```


> **Tip:** You can also serve `index.html` from any static host (S3 + CloudFront, GitHub Pages, etc.) without Node.js.

---

## ⚙️ Prerequisites

* **Node.js** (v14+ recommended) — only needed if you want to run a local HTTP server.
* **AWS Resources** (already deployed):

  * S3 buckets for `images/` and `articles/`
  * API Gateway endpoints
  * Lambda functions with Rekognition and ChatGPT integration

---

## 🛠️ Installation & Local Serve

1. Clone this repo:

   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```
2. Initialize the Node.js project (if you haven't already):

   ```bash
   npm init -y
   ```
3. Install dependencies (this will create the `node_modules` directory):

   ```bash
   npm install
   ```
4. (Optional) Install a static server to serve locally:

   ```bash
   npm install -g http-server
   ```
5. Start the server:

   ```bash
   http-server . -p 8080
   ```
6. Open your browser to `http://localhost:8080`.

---

## 🔧 Configuration

Inside `index.html`, update the following constants at the top of the `<script>` block:

```js
const IMAGE_URL_BASE   = "https://YOUR_IMAGE_BUCKET_DOMAIN";
const ARTICLE_URL_BASE = "https://YOUR_IMAGE_BUCKET_DOMAIN";
```

* Replace `YOUR_IMAGE_BUCKET_DOMAIN` with your S3 bucket (or CloudFront) URL that exposes `images/` and `articles/`.

If you’re securing uploads via `/sign-upload`, point the upload logic to your API Gateway signing endpoint instead of direct S3 PUTs.

---

## ⚡ How It Works

1. **Select & Upload**: User selects an image file and clicks **Upload & Generate**.
2. **Image Upload**: The front‑end issues a `PUT` to `IMAGE_URL_BASE/images/<filename>`.
3. **Processing**:

   * S3 triggers the **ImageProcessor** Lambda.
   * Lambda uses Amazon Rekognition to get labels from the image.
   * It builds a ChatGPT prompt and calls your ChatGPT API endpoint.
   * It writes the generated article to S3 `articles/<filename>.txt`.
4. **Polling**: The front‑end polls `ARTICLE_URL_BASE/articles/<filename>.txt` until the article is available.
5. **Display**: Once fetched, the text is rendered in the page.

---

## 📦 Deployment

1. **Front‑end**: Upload `index.html` to your static host (e.g., S3 + CloudFront, GitHub Pages).
2. **Backend**: Deploy your Swagger/OpenAPI definition to API Gateway, update Lambda code, and ensure S3 triggers and permissions are set as per documentation above.

---

## 🔒 Security Considerations

* Use **pre‑signed URLs** (`/sign-upload`) to avoid public write access on your `images/` bucket.
* Enable **HTTPS** via CloudFront or a custom domain.
* Lock down IAM roles: least privilege for Rekognition & S3.

---

## 🤝 Contributing

Feel free to open issues or pull requests for enhancements, bug fixes, or documentation improvements.

---

*Happy coding!*
