// SignUpload/index.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    // 1) Parse request
    const { filename, filetype } = JSON.parse(event.body);
    if (!filename || !filetype) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "filename and filetype required" })
        };
    }

    // 2) Build S3 key
    const key = `uploads/${Date.now()}-${filename}`;
8
    // 3) Presign a PUT URL   
    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
        Bucket: "groupj-is215-image-uploads",
        Key: key,
        Expires: 60,
        ContentType: filetype
    });

    // 4) Presign a GET URL for preview
    const getUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: "groupj-is215-image-uploads",
        Key: key,
        Expires: 300   // 5 minutes
    });

    // 5) Return all three values
    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ uploadUrl, getUrl, key })
    };
};
