# GroupJ Sign Upload Lambda

This Lambda function provides secure pre-signed URLs for uploading images to an S3 bucket. It is part of the **GroupJ Image to Article Processor** project and ensures that users can upload images to the `images/` folder in S3 securely.

---

## 🚀 Deployment Steps

Follow these steps to deploy the **GroupJ-SignUpload** Lambda function:

### 1. Initialize Node.js Project

First, initialize a new Node.js project in your working directory:

```bash
npm init -y
```

This will generate a `package.json` file that contains metadata about your Node.js project.

### 2. Zip the Folder

After configuring the necessary files and ensuring your project folder contains all the necessary dependencies, zip your entire project folder:

```bash
zip -r GroupJ-SignUpload.zip .
```

This creates a `.zip` file that includes all the contents of your project.

### 3. Upload to AWS Lambda

1. Go to the **AWS Management Console** and navigate to **AWS Lambda**.
2. Select the **GroupJ-SignUpload** Lambda function (or create a new Lambda function if not already created).
3. In the **Function code** section, choose **Upload from .zip file**.
4. Click **Upload** and select the `GroupJ-SignUpload.zip` file you just created.
5. Once the upload is complete, ensure the Lambda function has the necessary IAM roles and permissions to interact with S3 and perform the sign upload functionality.

### 4. Configure API Gateway

1. Create a new API or use an existing API in **API Gateway**.
2. Add a new endpoint (`/sign-upload`) to the API that invokes the **GroupJ-SignUpload** Lambda function.
3. Set up the correct HTTP method (typically **POST**) to trigger the Lambda function.

### 5. Test and Deploy

1. Set up your test events in AWS Lambda and trigger the function to ensure it generates pre-signed URLs correctly.
2. Once everything is working as expected, deploy your Lambda function and API Gateway endpoints.

---

## 🔧 Configuration

Make sure to update the following configuration in your Lambda function:

1. **S3 Bucket Name**: Ensure the Lambda function uses the correct S3 bucket name for uploading images.
2. **IAM Roles**: Ensure the Lambda function has the appropriate IAM role with permissions to access the S3 bucket and generate pre-signed URLs.

---

## 🧪 How It Works

1. A client sends a request to the `/sign-upload` endpoint to request a pre-signed URL.
2. The **GroupJ-SignUpload** Lambda function generates a pre-signed URL allowing the client to upload an image directly to the S3 bucket.
3. The client uses the pre-signed URL to upload the image to the `images/` folder in S3 securely.

---

## 🔒 Security Considerations

* Ensure that **IAM policies** are set to the least privilege for Lambda's role.
* Use **HTTPS** for API Gateway to secure the pre-signed URL requests.
* Restrict the expiration time of the pre-signed URL for security purposes.

---

## 🤝 Contributing

Feel free to open issues or submit pull requests for any improvements, bug fixes, or documentation enhancements.

---

*Happy coding!*
