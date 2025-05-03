# GroupJ Image to Article Processor

This repository contains the necessary code for processing images using AWS Rekognition and generating descriptive articles using ChatGPT. The Lambda function, **GroupJ-ImageToArticleProcessor**, is responsible for handling image uploads, detecting labels with Rekognition, and generating articles with ChatGPT.

---

## 🚀 Deployment Steps

Follow these steps to deploy the **GroupJ-ImageToArticleProcessor** Lambda function:

### 1. Initialize Node.js Project

First, initialize a new Node.js project in your working directory:

```bash
npm init -y
```

This will generate a `package.json` file that contains metadata about your Node.js project.

### 2. Zip the Folder

After completing the necessary configurations and ensuring all files are in the project folder, zip your entire project folder:

```bash
zip -r GroupJ-ImageToArticleProcessor.zip .
```

This creates a `.zip` file that includes all the contents of your project.

### 3. Upload to AWS Lambda

1. Go to the **AWS Management Console** and navigate to **AWS Lambda**.
2. Select the **GroupJ-ImageToArticleProcessor** Lambda function (or create a new Lambda function if not already created).
3. In the **Function code** section, choose **Upload from .zip file**.
4. Click **Upload** and select the `GroupJ-ImageToArticleProcessor.zip` file you just created.
5. Once the upload is complete, ensure the necessary IAM roles and permissions are correctly set for your Lambda function to interact with other AWS services like S3, Rekognition, and ChatGPT.

### 4. Test and Deploy

1. Set up your test events and invoke the Lambda function to ensure it's working as expected.
2. Once the Lambda function is successfully tested, deploy it.

---

## 🔧 Configuration

Before uploading, make sure to update the necessary environment variables and configuration settings, such as API keys for ChatGPT, S3 bucket names, or Rekognition settings.

---

## 🤝 Contributing

Feel free to contribute to this repository by submitting issues or pull requests for enhancements or bug fixes.

---

*Happy coding!*

