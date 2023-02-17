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

    const newPlan = JSON.parse(event.body);

    var params = {
      TableName: 'Plans',
      Item: {
        'Plan_Id':  uuid(),
        'User_Id': newPlan.User_Id,
        "Coping_Skills": newPlan.Coping_Skills,
        "Triggers": newPlan.Triggers
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
        callback(null, response)
      });
}