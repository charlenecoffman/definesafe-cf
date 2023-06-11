var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
const jwt_decode = require('jwt-decode');

exports.handler = async (event, context, callback) => {

    const response = InitialResponseObject();
    const updateMedication = JSON.parse(event.body);
    const user_id = GetUserIdFromHeaders(event);
    
    const queryData = await documentClient.query(GetQueryParams(user_id)).promise();

    if(queryData.Items.filter(m => m.Id == updateMedication.Medication_Id).length <= 0)
    {
        response.statusCode = 401;
        response.body = "This user is not allowed to execute this update";
        callback(null, response)
    }

    const updateResponse = await documentClient.update(GetUpdateParams(updateMedication)).promise();
    
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
    TableName: 'Medications',
    IndexName: 'User_Id',
    KeyConditionExpression: "User_Id = :User_Id",
    ExpressionAttributeValues: {
        ":User_Id": user_id
    },
    Select: 'ALL_ATTRIBUTES'
  };
}

const GetUpdateParams = (updateMedication) => {
  return {
    TableName: 'Medications',
    Key: {
        Medication_Id: updateMedication.Medication_Id
    },
    UpdateExpression: GetUpdateExpression(updateMedication),
    ConditionExpression: 'attribute_exists(Medication_Id)',
    ExpressionAttributeValues: GetExpressionAttributeValues(updateMedication)
  };
}

const GetExpressionAttributeValues = (updateMedication) => {
  var expressionAttributes = {};

  if(updateMedication.Medication_Name){
    expressionAttributes[':medicationName'] = updateMedication.Medication_Name;
  }

  if(updateMedication.Dosage_Quantity){
    expressionAttributes[':dosageQuantity'] = updateMedication.Dosage_Quantity;
  }

  if(updateMedication.Dosage_Unit){
    expressionAttributes[':dosageUnit'] = updateMedication.Dosage_Unit;
  }

  if(updateMedication.Times_Per){
    expressionAttributes[':timesPer'] = updateMedication.Times_Per;
  }

  if(updateMedication.Times_Per_Unit){
    expressionAttributes[':timesPerUnit'] = updateMedication.Times_Per_Unit;
  }

  if(updateMedication.Time_Taken){
    expressionAttributes[':timeTaken'] = updateMedication.Time_Taken;
  }

  if(updateMedication.Date_Started){
    expressionAttributes[':dateStarted'] = updateMedication.Date_Started;
  }

  if(updateMedication.Intended_Use){
    expressionAttributes[':intendedUse'] = updateMedication.Intended_Use;
  }

  if(updateMedication.Date_Stopped){
    expressionAttributes[':dateStopped'] = updateMedication.Date_Stopped;
  }

  if(updateMedication.Reason_For_Stop){
    expressionAttributes[':reasonForStop'] = updateMedication.Reason_For_Stop;
  }

  return expressionAttributes;
}

const GetUpdateExpression = (updateMedication) => {
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
    updateExpression += "Is_Active = :isActive";
  }
  return updateExpression.replace(/,\s*$/, "");
}