var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
const jwt_decode = require('jwt-decode');

exports.handler = async (event, context, callback) => {

    const response = InitialResponseObject();
    const updatePlan = JSON.parse(event.body);
    const user_id = GetUserIdFromHeaders(event);

    const getPlanParams = GetQueryParams(user_id);
    const updatePlanParams = GetUpdateParams(updatePlan);
    
    const queryData = await documentClient.query(getPlanParams).promise();

    if(queryData.Items[0].Plan_Id != updatePlan.Plan_Id)
    {
        response.statusCode = 401;
        response.body = "This user is not allowed to execute this update";
        callback(null, response)
    }

    const updateResponse = await documentClient.update(updatePlanParams).promise().then(resp => console.log(resp));
    
    console.log(updateResponse);
    
    response.body = JSON.stringify(updateResponse);
    callback(null, response);
}

const InitialResponseObject = () => {
  return {
    "statusCode": 200,
    "headers": {
        "Content-Type": "*/*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    }
  };
}

const GetUserIdFromHeaders = (event) => {
  const decoded = jwt_decode(event.headers["Authorization"]);
  return decoded.sub;
}

const GetQueryParams = (user_id) => {
  return {
    TableName: 'Plans',
    IndexName: 'User_Id',
    KeyConditionExpression: "User_Id = :User_Id",
    ExpressionAttributeValues: {
        ":User_Id": user_id
    },
    Select: 'ALL_ATTRIBUTES'
  };
}

const GetUpdateParams = (updatePlan) => {
  return {
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
}