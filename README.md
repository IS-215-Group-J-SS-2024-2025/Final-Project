# AWS S3 Bucket Setup

## Bucket Creation

Follow these steps to create and configure your AWS S3 bucket:

1. **Login to AWS Console**
   - Navigate to Services → **S3**.

2. **Create Bucket**
   - Click on **Create bucket**.
   - **Bucket name**: `groupj-is215-image-uploads`
   - **Region**: `us-east-1`

3. **Set Object Ownership**
   - Under **Object ownership**, click **Edit**.
   - Select **Bucket owner enforced**.
   - Click **Save**.

4. **Finalize Bucket Creation**
   - Leave all other settings at their defaults.
   - Click **Create bucket**.

## Create Folders

Inside the bucket, create the following folders:

- `uploads/`
- `articles/`

## Configure CORS

To configure Cross-Origin Resource Sharing (CORS):

1. Navigate to **Permissions** → **CORS configuration**.
2. Click **Edit** and paste the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT","GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Click **Save**.

Your AWS S3 bucket setup is now complete and ready for use.

