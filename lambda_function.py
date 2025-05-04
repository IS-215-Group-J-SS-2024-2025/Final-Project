import json
import boto3

# Initialize AWS clients
s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

def lambda_handler(event, context):
    try:
        # Get the bucket name and object key from the event
        record = event['Records'][0]
        bucket_name = record['s3']['bucket']['name']
        object_key = record['s3']['object']['key']

        # Only process files in the /uploads folder
        if not object_key.startswith("uploads/"):
            print(f"Skipping {object_key}, not in /uploads/")
            return {"statusCode": 200, "body": "Ignored non-upload object"}

        print(f"Processing image: {object_key} in {bucket_name}")

        # Call Amazon Rekognition for label detection
        response = rekognition.detect_labels(
            Image={'S3Object': {'Bucket': bucket_name, 'Name': object_key}},
            MaxLabels=10,
            MinConfidence=70
        )

        # Create output file name
        output_key = object_key.replace(".jpg", ".txt").replace(".png", ".txt").replace(".jpeg", ".txt")
        output_key = output_key.replace("uploads", "ar_out").replace(".jfif", ".txt")
        
        # Save JSON result to S3 as a .txt file
        s3.put_object(
            Bucket=bucket_name,
            Key=output_key,
            Body=json.dumps(response, indent=2),
            ContentType="text/plain"
        )

        print(f"Saved Rekognition labels to {output_key}")

        return {
            "statusCode": 200,
            "body": f"Processed {object_key} and saved results to {output_key}"
        }
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
