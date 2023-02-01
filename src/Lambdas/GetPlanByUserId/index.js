var aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const user_id_from_event_dot = event.user_id;
    const user_id_from_event_with_index = event["queryStringParameters"]["user_id"]
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        },
        "body": {"something": [user_id_from_event_dot, user_id_from_event_with_index]}
    };
    callback(null, response);
}