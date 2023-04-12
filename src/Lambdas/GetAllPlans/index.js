const aws = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const axios = require("axios").default;

const documentClient = new aws.DynamoDB.DocumentClient();
const secretsmanager = new aws.SecretsManager();

exports.handler = async (event, context, callback) => {

    const clientSecret = await secretsmanager.getSecretValue({SecretId: process.env.AUTH0_CLIENT_SECRET_NAME}).promise();
    const options1 = {
      method: 'POST',
      url: process.env.URL,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: clientSecret,
        audience: process.env.AUDIENCE
      })
    };
    
    console.log(options1);
    var adminToken = await axios.request(options1);

    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;

    const options2 = { 
      method: "GET",
      url: "https://login.auth0.com/api/v2/users/" + user_id,
      headers: { "authorization": "Bearer " + adminToken },
    };

    console.log(options2);
    var user = await axios.request(options2);

    console.log(user);

    const response = {
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
