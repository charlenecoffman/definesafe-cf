var aws = require('aws-sdk');

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
      UpdateExpression: 'set #triggers = :triggers, #copingSkills = :copingSkills',
      ExpressionAttributeNames: {'#triggers' : 'Triggers', '#copingSkills' : 'Coping_Skills'},
      ExpressionAttributeValues: {
        ':triggers' : updatePlan.Triggers,
        ':copingSkills' : updatePlan.CopingSkills,
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
        callback(null, response)
      });
    
}