var aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const user_id = event["queryStringParameters"]["user_id"]


    const response ={
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "*/*" },
        "body": {"something": user_id}
    };
    callback(null, response);
}