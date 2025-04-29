'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

// MAKE SURE THAT ENVIRONMENT VARIABLES ARE SET
const S3_BUCKET = process.env.BUCKET;
const S3_URL = process.env.URL;
const IAM_ROLE = process.env.ROLE_ARN; 

exports.handler = function(event, context, callback) {
    const key = event.Records[0].s3.object.key;
    if (key.indexOf('outs/') >= 0) {
      // DO NOT include for analysis
      // those files inside the outs folder
      return;
    }
  
    S3.getObject({Bucket: S3_BUCKET, Key: key}).promise()
      .then((data) => {

        // USE ASSUMED ROLE OF LAMBDA AND S3 ACCOUNTS
        const sts = new AWS.STS();
        const role_params = {
            RoleArn: IAM_ROLE,
            RoleSessionName: 'LambdaAssumeRoleSession'
        };
        const data_role = sts.assumeRole(role_params).promise();
        const creds = data_role.Credentials;

        // TRANSFER CREDENTIALS FOR THE API FUNCTION CALL
        AWS.config.credentials = creds;

        // PREPARE API PARAMETERS
        const client = new AWS.Rekognition();
        const params = {
          Image: {
            S3Object: {
              Bucket: S3_BUCKET,
              Name: key
            },
          },
          MaxLabels: 10
        }

        // CALL API AND FORMAT RESULT
        client.detectLabels(params, function(err, response) {
          var buffer = "";
          if (err) {
            buffer += err + `<br/>` + err.stack; // if an error occurred
          } else {
            buffer = JSON.stringify(response);
          } // if

          // PLACE OUTPUT IN outs FOLDER
          S3.putObject({
            Body: buffer,
            Bucket: S3_BUCKET,
            ContentType: "text/html; charset=utf-8",
            Key: `outs/${key}.txt`,
          }).promise()
        });
      })
      .then(() => callback(null, {
          statusCode: '301',
          headers: {'location': `${S3_URL}/${key}`},
          body: '',
        })
      )
      .catch(err => callback(err))
}