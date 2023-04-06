var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
const jwt_decode = require('jwt-decode');
var axios = require("axios").default;

exports.handler = async (event, context, callback) => {


    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub.split("@")[0];

    var options = {
      method: 'POST',
      url: process.env.URL,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: '{yourClientSecret}',
        audience: process.env.AUDIENCE
      })
    };
    
    axios.request(options).then(function (response) {
      
    }).catch(function (error) {
      console.error(error);
    });

    const response ={
      "statusCode": 200,
      "headers": {
          "Content-Type": "*/*"
      }
    };
  
    const params = {
      TableName: 'Plans'
    };
    
    await documentClient.scan(params)
      .promise()
      .then(resp => {
        response.body = JSON.stringify(resp);
        callback(null, response);
      })
      .catch(err => {
        response.body = JSON.stringify(err);
        callback(null, response)
      });
}
