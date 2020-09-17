import React, { Component } from 'react';

var AWS = require('aws-sdk');
var credentials = {
    accessKeyId: "add your own key",
    secretAccessKey : "add your own key"
};
AWS.config.update({credentials: credentials, region: process.env.REACT_APP_S3_REGION});
var s3 = new AWS.S3();

// var presignedPUTURL = s3.getSignedUrl('putObject', {
//     Bucket: 'pensieve-test-1027',
//     Key: 'csvs/test.csv', //filename
//     Expires: 100 //time to expire in seconds
// });



export default class FileDialogue extends React.Component {
  componentDidMount(){
  }

  upload(e){
    var reader = new FileReader();
    var key = e.target.files[0].name
    // start reading the file. When it is done, calls the onload event defined above.
    reader.onload = function(data) {
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: key,
        Body: data.target.result
      }
      s3.upload(params, function(err, data) {
          if (err) {
              throw err;
          }
          console.log("yay");
      })
    }
    reader.readAsText(e.target.files[0]);
  }

  render(){
    return (<input
            type="file"
            onChange={this.upload}
            accept=".csv" required/>
          )
  }
}
