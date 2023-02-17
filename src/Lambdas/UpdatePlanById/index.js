var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const updatePlan = JSON.parse(event.body);

    var params = {
      TableName: 'Plans',
      Key: {
        Plan_Id: updatePlan.Plan_Id
      },
      UpdateExpression: 'SET Triggers = :triggers, Coping_Skills = :copingSkills',
      ExpressionAttributeValues: {
        ':triggers' : updatePlan.Triggers,
        ':copingSkills' : updatePlan.Coping_Skills,
      }
    };

    await documentClient.update(params)
      .promise()
      .then(resp => {
        response.body = JSON.stringify(resp);
        callback(null, response);
      })
      .catch(err => {
        response.body = JSON.stringify(err);
        response.body += JSON.stringify(params);
        callback(null, response)
      });
    
}