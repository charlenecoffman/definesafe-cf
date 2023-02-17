var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const qsParams = JSON.parse(event.queryStringParameters );

    var params = {
      TableName: 'Plans',
      Key: {
        'User_Id':  qsParams.User_Id
      }
    };

    await documentClient.get(params)
      .promise()
      .then(resp => {
        response.body = JSON.stringify(params);
        callback(null, response);
      })
      .catch(err => {
        response.body = JSON.stringify(err);
        callback(null, response)
      });
}