'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;

exports.handler = function(event, context, callback) {
    const key = event.Records[0].s3.object.key;
    S3.getObject({Bucket: BUCKET, Key: key}).promise()
      .then((data) => {
        // process rekognition analysis here
        // and return 
      })
      .then(() => callback(null, {
          statusCode: '301',
          headers: {'location': `${URL}/${key}`},
          body: '',
        })
      )
      .catch(err => callback(err))
}