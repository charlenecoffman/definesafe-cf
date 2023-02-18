var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const qsParams = event.queryStringParameters;

    var params = {
      TableName: 'Plans',
      IndexName: 'User_Id',
      KeyConditionExpression: "User_Id = :User_Id",
      ExpressionAttributeValues: {
          ":User_Id": qsParams.User_Id
      },
      Select: 'ALL_ATTRIBUTES'
    };

    await documentClient.query(params)
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