'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

const S3_BUCKET = BUCKET;
const S3_URL = URL;
const REGION_NAME = 'us-east-1';

const mime = require("mime-types");
const unzip = require("unzipper");

exports.handler = function(event, context, callback) {
    const key = event.Records[0].s3.object.key;
    S3.getObject({Bucket: S3_BUCKET, Key: key}).promise()
      .then((data) => {
        // process rekognition analysis here
        // and return 

        var creds = new AWS.SharedIniFileCredentials({});
        AWS.config.credentials = creds;
        AWS.config.update({region:REGION_NAME});

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

        client.detectLabels(params, function(err, response) {
          var buffer = "START;";
          if (err) {
            buffer += err + `<br/>` + err.stack; // if an error occurred
          } else {
            buffer += `Detected labels for: ${photo}` + `<br/>`;
            response.Labels.forEach(label => {
              buffer += `Label:      ${label.Name}` + `<br/>`;
              buffer += `Confidence: ${label.Confidence}`+ `<br/>`;
              buffer += "Instances:"+ `<br/>`;
              label.Instances.forEach(instance => {
                let box = instance.BoundingBox
                buffer += "  Bounding box:"+ `<br/>`;
                buffer += `    Top:        ${box.Top}`+ `<br/>`;
                buffer += `    Left:       ${box.Left}`+ `<br/>`;
                buffer += `    Width:      ${box.Width}`+ `<br/>`;
                buffer += `    Height:     ${box.Height}`+ `<br/>`;
                buffer += `  Confidence: ${instance.Confidence}`+ `<br/>`;
              })
              buffer += "Parents:"+ `<br/>`;
              label.Parents.forEach(parent => {
                buffer += `  ${parent.Name}`+ `<br/>`;
              })
              buffer += "------------"+ `<br/>`;
              buffer += "<br/>END"+ `<br/>`;
            }) // for response.labels
          } // if
          S3.putObject({
            Body: buffer,
            Bucket: S3_BUCKET,
            ContentType: "text/html; charset=utf-8",
            Key: 'outs/${key}',
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