const aws = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const axios = require("axios").default;

const documentClient = new aws.DynamoDB.DocumentClient();
const secretsmanager = new aws.SecretsManager();
const lambdahandler = new aws.Lambda();

exports.handler = async (event, context, callback) => {
    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;

    var lambdaParams = {
      FunctionName: 'GetUserPermissions',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({user_id: user_id})
    };

    var permissions = await lambdahandler.invoke(lambdaParams).promise();
    console.log(permissions);
    const clientSecret = await secretsmanager.getSecretValue({SecretId: process.env.AUTH0_CLIENT_SECRET_NAME}).promise();
    
    const adminTokenRequestParams = {
      method: 'POST',
      url: process.env.URL,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: JSON.parse(clientSecret.SecretString).ClientSecret,
        audience: process.env.AUDIENCE
      })
    };
    
    var adminToken = (await axios.request(adminTokenRequestParams)).data.access_token;

    const getUserInfoRequestParams = { 
      method: "GET",
      url: "https://definesafe.us.auth0.com/api/v2/users/" + user_id + "/permissions",
      headers: { "authorization": "Bearer " + adminToken },
    };

    var permissions = (await axios.request(getUserInfoRequestParams)).data.map(p => p.permission_name);

    if(!permissions.includes("write:admin")){
      callback(null, {
        "statusCode": 401,
        "body": "This user is not an admin user",
        "headers": {
            "Content-Type": "*/*"
        }
      })
    }

    const response = {
      "statusCode": 200,
      "headers": {
          "Content-Type": "*/*"
      }
    };
  
    const params = {
      TableName: 'Plans'
    };
    console.log("test");
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
