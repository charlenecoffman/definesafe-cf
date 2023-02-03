var aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const plan_id = event["queryStringParameters"]["plan_id"]
    const response ={
        "statusCode": 204,
        "headers": {
            "Content-Type": "*/*"
        }
    };
    callback(null, response);
}