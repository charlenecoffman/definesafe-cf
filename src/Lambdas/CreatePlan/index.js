const { uuid } = require('uuidv4');
var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 201,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    var params = {
      TableName: 'Plans',
      Item: {
        'Plan_Id':  uuid(),
        'User_Id': event.body.User_Id,
        "Coping_Skills": event.body.Coping_Skills,
        "Triggers": event.body.Triggers
      }
    };
    await documentClient.put(params)
      .promise()
      .then(resp => {
        response.body = JSON.stringify(params);
        callback(null, response);
      })
      .catch(err => {
        response.body = JSON.stringify(err);
        response.body += JSON.stringify(params);
        callback(null, response)
      });
}