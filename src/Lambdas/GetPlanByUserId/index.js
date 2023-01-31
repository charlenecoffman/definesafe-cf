var aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const user_id = event.user_id;
    const response = {user_id_sent: `${user_id}!`};
    callback(null, response);
}