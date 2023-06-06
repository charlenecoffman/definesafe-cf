var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
const jwt_decode = require('jwt-decode');

exports.handler = async (event, context, callback) => {

    const response = InitialResponseObject();
    const updatePlan = JSON.parse(event.body);
    const user_id = GetUserIdFromHeaders(event);
    
    const queryData = await documentClient.query(GetQueryParams(user_id)).promise();

    if(queryData.Items[0].Plan_Id != updatePlan.Plan_Id)
    {
        response.statusCode = 401;
        response.body = "This user is not allowed to execute this update";
        callback(null, response)
    }

    const updateResponse = await documentClient.update(GetUpdateParams(updatePlan)).promise();
    
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
    UpdateExpression: GetUpdateExpression(updatePlan),
    ConditionExpression: 'attribute_exists(Plan_Id)',
    ExpressionAttributeValues: GetExpressionAttributeValues(updatePlan)
  };
}

const GetExpressionAttributeValues = (updatePlan) => {
  var expressionAttributes = {};

  if(updatePlan.Triggers){
    expressionAttributes[':triggers'] = updatePlan.Triggers;
  }

  if(updatePlan.Coping_Skills){
    expressionAttributes[':copingSkills'] = updatePlan.Coping_Skills;
  }

  if(updatePlan.Warning_Signs){
    expressionAttributes[':warningSigns'] = updatePlan.Warning_Signs;
  }

  if(updatePlan.Self_Talk_Statements){
    expressionAttributes[':selfTalkStatements'] = updatePlan.Self_Talk_Statements;
  }

  if(updatePlan.Safe_Spaces){
    expressionAttributes[':safeSpaces'] = updatePlan.Safe_Spaces;
  }

  if(updatePlan.Contacts){
    expressionAttributes[':contacts'] = updatePlan.Contacts;
  }

  if(updatePlan.Effective_Date){
    expressionAttributes[':effectiveDate'] = updatePlan.Effective_Date;
  }

  if(updatePlan.Is_Active != null && updatePlan.Is_Active != undefined){
    expressionAttributes[':isActive'] = updatePlan.Is_Active;
  }

  return expressionAttributes;
}

const GetUpdateExpression = (updatePlan) => {
  var updateExpression = "SET ";

  if(updatePlan.Triggers){
    updateExpression += "Triggers = :triggers, ";
  }

  if(updatePlan.Coping_Skills){
    updateExpression += "Coping_Skills = :copingSkills, ";
  }

  if(updatePlan.Warning_Signs){
    updateExpression += "Warning_Signs = :warningSigns, ";
  }

  if(updatePlan.Self_Talk_Statements){
    updateExpression += "Self_Talk_Statements = :selfTalkStatements, ";
  }

  if(updatePlan.Safe_Spaces){
    updateExpression += "Safe_Spaces = :safeSpaces, ";
  }

  if(updatePlan.Contacts){
    updateExpression += "Contacts = :contacts, ";
  }

  if(updatePlan.Effective_Date){
    updateExpression += "Effective_Date = :effectiveDate, ";
  }

  if(updatePlan.Is_Active != null && updatePlan.Is_Active != undefined){
    updateExpression += "Is_Active = :isActive, ";
  }
  return updateExpression;
}