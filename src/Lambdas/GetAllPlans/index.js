var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
const jwt_decode = require('jwt-decode');

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        }
    };
    
    var params = {
      TableName: 'Plans'
    };

    console.log(event.headers)

    var decoded = jwt_decode(event.headers["Authorization"]);

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
