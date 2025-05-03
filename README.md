GroupJ AWS Rekog + Article Generation Using Serverless Microservices Architecture
This repository features a Node.js-based static front-end that allows users to upload images and receive AI-generated descriptive articles through an AWS Serverless backend (API Gateway + Lambda + S3).

🚀 Live Demo
You can view the live demo of the project deployed in an EC2 instance here: Live Demo

🚀 Project Overview
Front-end: A static HTML page (index.html) served via Node.js (or any static host), providing an image picker and displaying the resulting article. You can find this in the feature/frontend-ui branch.

Backend: AWS API Gateway exposes the /process-image endpoint:

/process-image — accepts image uploads via PUT to the S3 images/ folder, triggering a Lambda function that:

Uses Amazon Rekognition (from /feature/rekognition-analysis) to detect labels in the image.

Uses ChatGPT (from /feature/chatgpt-generation) to generate an article based on those labels.

Saves the generated article as a .txt file in the articles/ folder on S3.

/sign-upload — provides pre-signed URLs for secure image uploads (optional helper service).

📂 Folder Structure
⚠️ This layout reflects the feature/frontend-ui branch.

bash
Copy
feature/frontend-ui/
├─ index.html         # Static front-end HTML + JS
├─ package.json       # Node.js metadata (if using a local server)
└─ README.md          # Project documentation

Tip: You can serve index.html from any static host (e.g., S3 + CloudFront, GitHub Pages) without using Node.js.

⚙️ Prerequisites
Node.js (v14+ recommended) — needed only if you plan to run a local HTTP server.

AWS Resources (already deployed):

S3 buckets for images/ and articles/

API Gateway endpoints

Lambda functions with Rekognition and ChatGPT integration

🛠️ Installation & Local Serve
Clone this repository:

bash
Copy
git clone <your-repo-url>
cd <your-project-folder>
Initialize the Node.js project (if you haven’t already):

bash
Copy
npm init -y
Install the necessary dependencies:

bash
Copy
npm install
(Optional) Install a static server for local testing:

bash
Copy
npm install -g http-server
Start the server:

bash
Copy
http-server . -p 8080
Open the browser at http://localhost:8080.

🔧 Configuration
Update the following constants in the index.html file at the top of the <script> block:

js
Copy
const IMAGE_URL_BASE   = "https://YOUR_IMAGE_BUCKET_DOMAIN";
const ARTICLE_URL_BASE = "https://YOUR_IMAGE_BUCKET_DOMAIN";
Replace YOUR_IMAGE_BUCKET_DOMAIN with your S3 bucket (or CloudFront) URL that exposes the images/ and articles/ directories.

If you're securing uploads using the /sign-upload endpoint, point the upload logic to your API Gateway signing endpoint instead of directly uploading to S3.

⚡ How It Works
Select & Upload: The user selects an image and clicks Upload & Generate.

Image Upload: The front-end issues a PUT request to IMAGE_URL_BASE/images/<filename>.

Processing:

S3 triggers the ImageProcessor Lambda, which combines functionality from the /feature/rekognition-analysis and /feature/chatgpt-generation functions.

The Lambda uses Amazon Rekognition to analyze the image and detect labels.

It sends those labels as a prompt to ChatGPT to generate a descriptive article.

The article is saved as a .txt file in the articles/ folder in S3.

Polling: The front-end polls ARTICLE_URL_BASE/articles/<filename>.txt until the article is ready.

Display: Once available, the text is rendered on the page.

📦 Deployment
Front-end: Upload index.html to your static host (e.g., S3 + CloudFront, GitHub Pages).

Backend: Deploy the Swagger/OpenAPI definition to API Gateway, update the Lambda code (combining functions from /feature/rekognition-analysis and /feature/chatgpt-generation), and ensure S3 triggers and permissions are properly set as mentioned in the documentation.

🔒 Security Considerations
Use pre-signed URLs (/sign-upload) to avoid public write access on the images/ bucket.

Enable HTTPS via CloudFront or a custom domain.

Apply least privilege IAM roles for Rekognition & S3.

🤝 Contributing
Feel free to open issues or pull requests for enhancements, bug fixes, or documentation improvements.

Happy coding!

