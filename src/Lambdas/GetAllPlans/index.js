const aws = require('aws-sdk');
const jwt_decode = require('jwt-decode');

const documentClient = new aws.DynamoDB.DocumentClient();
const lambdahandler = new aws.Lambda();

exports.handler = async (event, context, callback) => {
    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;

    var lambdaParams = {
      FunctionName: 'GetUserPermissions',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({user_id: user_id})
    };

    var permissionResponse = await lambdahandler.invoke(lambdaParams).promise();
    var userPermissions = JSON.parse(permissionResponse.Payload);
    
    if(!userPermissions.includes("write:admin")){
      callback(null, {
        "statusCode": 401,
        "body": "This user is not an admin user",
        "headers": {
            "Content-Type": "*/*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
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
