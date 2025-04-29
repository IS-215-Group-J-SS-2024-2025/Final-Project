# Lambda Core Creation

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
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
- **AWS account with Lambda and S3 permissions**

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
    - `CHATGPT_API_KEY=legaspi-9OgQcXhBym`
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

## Usage <a name="usage"></a>

### `GroupJ-ImageToArticleProcessor`
Automatically generates descriptive articles when images are uploaded to the `uploads/` directory of your configured S3 bucket.

### `GroupJ-SignUpload`
Provides secure, signed URLs for frontend or external applications to upload images directly to your configured S3 bucket. Call via API Gateway with JSON payload:

```json
{
  "filename": "your-image.jpg",
  "filetype": "image/jpeg"
}
```

