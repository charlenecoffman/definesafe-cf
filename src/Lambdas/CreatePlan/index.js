var aws = require('aws-sdk');
var uuid = require('uuid');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 201,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const newPlan = event.body;

    newPlan.Plan_Id = uuid.v1();

    var params = {
        TableName: 'TABLE',
        Item: {
          'Plan_Id': newPlan.Plan_Id,
          'User_Id': newPlan.User_Id,
          "Coping_Skills": newPlan.Coping_Skills,
          "Triggers": newPlan.Triggers
        }
      };
      
      documentClient.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });

    response.body = newPlan;
    callback(null, response);
}