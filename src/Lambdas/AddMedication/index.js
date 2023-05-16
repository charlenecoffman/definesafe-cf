const { uuid } = require('uuidv4');
var aws = require('aws-sdk');
const jwt_decode = require('jwt-decode');
var documentClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const response ={
        "headers": {
            "Content-Type": "*/*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        }
    };

    const newMedication = JSON.parse(event.body);

    if(newMedication.Medication_Name === ""){
        response.body = "Medication name is required";
        response.statusCode = 500;
        callback(null, response)
    }
    
    const decoded = jwt_decode(event.headers["Authorization"]);
    const user_id = decoded.sub;

    var params = {
      TableName: 'Medications',
      Item: {
        'Medication_Id':  uuid(),
        'User_Id': user_id,
        "Medication_Name": newMedication.Medication_Name,
        "Dosage_Quantity": newMedication.Dosage_Quantity,
        "Dosage_Unit": newMedication.Dosage_Unit,
        "Times_Per": newMedication.Times_Per,
        "Times_Per_Unit": newMedication.Times_Per_Unit,
        "Time_Taken": newMedication.Time_Taken,
        "Date_Started": newMedication.Started_Taking,
        "Intended_Use": newMedication.Intended_Use,
        "Date_Stopped": newMedication.Stopped_Taking,
        "Reason_For_Stop": newMedication.Reason_For_Stop
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