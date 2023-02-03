var aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const plan_id = event["queryStringParameters"]["plan_id"]
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        },
        "body": {"Plan Id": plan_id}
    };
    callback(null, response);
}