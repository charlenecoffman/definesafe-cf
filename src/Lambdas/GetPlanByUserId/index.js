var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;
    
    var params = {
      TableName: 'Plans',
      IndexName: 'User_Id',
      KeyConditionExpression: "User_Id = :User_Id",
      ExpressionAttributeValues: {
          ":User_Id": user_id
      },
      Select: 'ALL_ATTRIBUTES'
    };

    console.log("test");

    await documentClient.query(params)
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
