var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
const jwt_decode = require('jwt-decode');

exports.handler = async (event, context, callback) => {

    const response = InitialResponseObject();
    const user_id = GetUserIdFromHeaders(event);
    const medication_id = GetMedicationIdFromPath(event);

    const getMedicationsParams = GetQueryParams(user_id);
    const removeMedicationParams = GetRemoveParams(medication_id);
    
    const queryData = await documentClient.query(getMedicationsParams).promise();

    if(queryData.Items.find(med => med.Medication_Id === medication_id) == undefined)
    {
        response.statusCode = 401;
        response.body = "This user is not allowed to execute this update";
        callback(null, response)
    }

    const deleteResponse = await documentClient.delete(removeMedicationParams).promise();

    response.body = JSON.stringify(deleteResponse);
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

const GetMedicationIdFromPath = (event) => {
    return event['queryStringParameters']["medication_id"];
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

const GetRemoveParams = (medication_id) => {
  return {
    TableName: 'Medications',
    Key: {
      Medication_Id: medication_id
    }
  };
}