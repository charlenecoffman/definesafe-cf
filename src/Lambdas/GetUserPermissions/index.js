const axios = require("axios").default;
var aws = require('aws-sdk');

const secretsmanager = new aws.SecretsManager();

exports.handler = async (event, context, callback) => {
    
    const clientSecret = await secretsmanager.getSecretValue({SecretId: process.env.AUTH0_CLIENT_SECRET_NAME}).promise();
    const adminTokenRequestParams = {
      method: 'POST',
      url: process.env.URL,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: JSON.parse(clientSecret.SecretString).ClientSecret,
        audience: process.env.AUDIENCE
      })
    };
    
    var adminToken = (await axios.request(adminTokenRequestParams)).data.access_token;
    const getUserInfoRequestParams = { 
      method: "GET",
      url: "https://definesafe.us.auth0.com/api/v2/users/" + event.user_id + "/permissions",
      headers: { "authorization": "Bearer " + adminToken },
    };

    var permissions = (await axios.request(getUserInfoRequestParams)).data.map(p => p.permission_name);
    return JSON.stringify(permissions)
}
