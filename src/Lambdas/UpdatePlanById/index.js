var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        }
    };

    const updatePlan = JSON.parse(event.body);

    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;

    var getPlanParams = {
      TableName: 'Plans',
      IndexName: 'User_Id',
      KeyConditionExpression: "User_Id = :User_Id",
      ExpressionAttributeValues: {
          ":User_Id": user_id
      },
      Select: 'ALL_ATTRIBUTES'
    };
    someFunction();
    await documentClient.query(getPlanParams)
      .promise()
      .then(resp => {
        console.log(resp);
        if(resp.Plan_Id !== updatePlan.Plan_Id){
          response.statusCode = 401;
          response.body = "This user is not allowed to execute this update";
          callback(null, response)
        }
      })
      .catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify(err);
        callback(null, response)
      });

    var params = {
      TableName: 'Plans',
      Key: {
        Plan_Id: updatePlan.Plan_Id
      },
      UpdateExpression: 'SET Triggers = :triggers, Coping_Skills = :copingSkills',
      ConditionExpression: 'attribute_exists(Plan_Id)',
      ExpressionAttributeValues: {
        ':triggers' : updatePlan.Triggers,
        ':copingSkills' : updatePlan.Coping_Skills,
      }
    };

    await documentClient.update(params)
      .promise()
      .then(resp => {
        console.log(resp);
        response.body = JSON.stringify(updatePlan);
        callback(null, response);
      })
      .catch(err => {
        response.body = JSON.stringify(err);
        response.body += JSON.stringify(params);
        callback(null, response)
      });
    
}

const someFunction = () => {
  console.log("testing 1234")
}