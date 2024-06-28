const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  console.log(event);
  if(!event.headers.authorization || event.headers.authorization == null || event.headers.authorization == ""){
    console.log('Sin token');
    return generateIamPolicy(null);
  }
  
  if(!event.queryStringParameters.username || event.queryStringParameters.username == null || event.queryStringParameters.username == ""){
    console.log('Sin usuario');
    return generateIamPolicy(null);
  }
  
  try{
    let username = event.queryStringParameters.username;
    let token = event.headers.authorization;
    let params = {
      Key: {
        "user": {
          S: username
        }
      },
      TableName: process.env.tablename
    };
    let res = await dynamodb.getItem(params).promise();
    if(res.Item.token.S == token){
      
    console.log('Token Correcto');  
    return generateIamPolicy({ username });
 
    }else{
      console.log('No es el mismo token');
      return generateIamPolicy(null);
    }
    
  }catch(e){
    console.log(e);
    return generateIamPolicy(null);
  }
};

function generateIamPolicy(data) {
  return {
    principalId: JSON.stringify(data),
    policyDocument: {
      Version: "2012-10-17",
      Statement: [{
        Action: "execute-api:Invoke",
        Effect: data ? 'Allow' : 'Deny',
        Resource: "*"
      }]
    },
    context: {
      stringKey: "value",
      numberKey: "1",
      booleanKey: "true"
    },
    usageIdentifierKey: "abc"
  };
}
