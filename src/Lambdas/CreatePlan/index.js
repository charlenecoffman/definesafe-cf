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
    response.body = newPlan;
    callback(null, response);
}