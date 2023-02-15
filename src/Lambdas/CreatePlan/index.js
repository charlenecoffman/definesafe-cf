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

    const newPlan = event.body;

    newPlan.Plan_Id = uuid();

    console.log(newPlan);

    var params = {
      TableName: 'Plans',
      Item: {
        'Plan_Id': newPlan.Plan_Id,
        'User_Id': newPlan.User_Id,
        "Coping_Skills": newPlan.Coping_Skills, //okidoke
        "Triggers": newPlan.Triggers
      }
    };
    await documentClient.put(params)
      .promise()
      .catch(err => {
        response.body = JSON.stringify(err);
        callback(null, response)
      });

    response.body = JSON.stringify(newPlan);
    callback(null, response);
}