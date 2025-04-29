# Lambda Core Creation

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [API Gateway Setup](#api_gateway)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name="about"></a>

This project includes two AWS Lambda functions designed to process images and generate descriptive articles automatically, leveraging AWS Rekognition for image analysis and OpenAI's GPT model for article generation. Additionally, it provides a signed URL service for secure uploads to AWS S3. This streamlines content creation workflows, automating text generation based on uploaded images, suitable for blogs, news sites, or automated reporting systems.

## Getting Started <a name="getting_started"></a>

These instructions will help you get a copy of the Lambda functions running locally for development and testing purposes, as well as guide you through deploying them to AWS Lambda.

### Prerequisites <a name="prerequisites"></a>

- **Node.js 18.x**
- **npm**
- **AWS CLI** (configured with appropriate credentials and permissions)
- **AWS account with Lambda, API Gateway, and S3 permissions**

Example installation:

```bash
# Install Node.js via https://nodejs.org/
# Verify installations
node -v
npm -v
aws --version
```

### Installing <a name="installing"></a>

#### Lambda #1: `GroupJ-ImageToArticleProcessor`

Setup and deploy the Lambda function following these steps:

```bash
mkdir ImageProcessor && cd ImageProcessor
npm init -y
npm install aws-sdk

cat > index.js <<'EOF'
// [Your Lambda function code here, as previously defined]
EOF

zip -r ../GroupJ-ImageProcessor.zip ./*
```

- **AWS Lambda Console:**
  - Create function named `GroupJ-ImageToArticleProcessor` (Runtime: **Node.js 18.x**, Role: **labrole**).
  - Upload the ZIP file `GroupJ-ImageProcessor.zip`.
  - Set environment variables:
    - `CHATGPT_ENDPOINT=https://is215-openai.upou.io/v1/chat/completions`
    - `CHATGPT_API_KEY={DEDICATED API KEY FROM BONUS ACTIVITY}`
  - Add an S3 trigger from bucket `groupj-is215-image-uploads` (Event: **All object creates**, Prefix: `uploads/`).

#### Lambda #2: `GroupJ-SignUpload`

Setup and deploy the Lambda function following these steps:

```bash
mkdir SignUpload && cd SignUpload
npm init -y
npm install aws-sdk

cat > index.js <<'EOF'
// [Your Lambda function code here, as previously defined]
EOF

zip -r ../GroupJ-SignUpload.zip ./*
```

- **AWS Lambda Console:**
  - Create function named `GroupJ-SignUpload` (Runtime: **Node.js 18.x**, Role: **labrole**).
  - Upload the ZIP file `GroupJ-SignUpload.zip`.
  - Set handler: `index.handler`.

### API Gateway Setup <a name="api_gateway"></a>

Set up the API Gateway to expose your Lambda functions as HTTP APIs.

- Go to **API Gateway** → **HTTP APIs** → **Create API**:
  - Name: `GroupJ-SignUploadAPI`, IPv4

- **Add Integrations**:
  - Add integration → Lambda → `GroupJ-SignUpload` (Payload format version **2.0**)
  - Add integration → Lambda → `GroupJ-ImageToArticleProcessor` (Payload format version **2.0**)

- **Routes**:
  - Add route: `POST /sign-upload` → Integration: `GroupJ-SignUpload`
  - Add route: `POST /process-image` → Integration: `GroupJ-ImageToArticleProcessor`

- **CORS Configuration**:
  - Configure CORS → Origins: `*`, Methods: `POST,OPTIONS`, Headers: `Content-Type`, Max age: `3600`

- **Deploy**:
  - Click Deploy → pushes to `$default`

- **Invoke URL**:
  - Copy the base URL from **Stages** → `$default`, e.g.,

```bash
https://your-api-id.execute-api.region.amazonaws.com
```

## Usage <a name="usage"></a>

### `GroupJ-ImageToArticleProcessor`
Automatically generates descriptive articles from images uploaded via `GroupJ-SignUpload`. Call via API Gateway with JSON payload:

```bash
POST https://your-api-id.execute-api.region.amazonaws.com/process-image
```

Payload example (use "key" from `GroupJ-SignUpload` response):

```json
{
  "key": "uploads/1745626706399-images.jpg"
}
```

Example response:

```json
{
  "articleUrl": "https://groupj-is215-image-uploads.s3.amazonaws.com/articles/your-article.txt?..."
}
```

### `GroupJ-SignUpload`
Provides secure, signed URLs for frontend or external applications to upload images directly to your configured S3 bucket. Call via API Gateway with JSON payload:

```bash
POST https://your-api-id.execute-api.region.amazonaws.com/sign-upload
```

Payload:
```json
{
  "filename": "your-image.jpg",
  "filetype": "image/jpeg"
}
```

Example response:

```json
{
  "uploadUrl": "https://groupj-is215-image-uploads.s3.amazonaws.com/uploads/your-image.jpg?...",
  "key": "uploads/your-image.jpg"
}
```

