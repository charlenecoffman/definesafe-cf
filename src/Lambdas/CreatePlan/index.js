const { uuid } = require('uuidv4');
var aws = require('aws-sdk');
const jwt_decode = require('jwt-decode');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const newPlan = JSON.parse(event.body);
    
    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;

    var params = {
      TableName: 'Plans',
      Item: {
        'Plan_Id':  uuid(),
        'User_Id': user_id,
        "Coping_Skills": newPlan.Coping_Skills,
        "Triggers": newPlan.Triggers
      }
    };
    
    await documentClient.put(params)
      .promise()
      .then(() => {
        response.body = JSON.stringify(params);
        response.statusCode = 201;
        callback(null, response);
      })
      .catch(err => {
        response.body = JSON.stringify(err);
        response.statusCode = 500;
        callback(null, response)
      });
}