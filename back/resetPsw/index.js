const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  try {
    let body = JSON.parse(event.body);
    console.log(body);
    if (!body || body === undefined || body == '' ||
      !body.email || body.email === undefined || body.email == '' || body.email == 0) {
      return {
        statusCode: 400,
        body: JSON.stringify('Bad Format'),
      };
    }

    let paramsUpdate = {
      ReturnValues: "ALL_NEW",
      TableName: process.env.tablename,
      UpdateExpression: "SET"
    };

    paramsUpdate.Key = {
      "user": {
        S: body.email
      }
    };
    paramsUpdate.ExpressionAttributeNames = {};
    paramsUpdate.ExpressionAttributeValues = {};

    delete body.email;
    for (const element in body) {
      paramsUpdate.ExpressionAttributeNames[`#${element}`] = `${element}`;
      paramsUpdate.ExpressionAttributeValues[`:${element}`] = { S: body[element].toString() };
      paramsUpdate.UpdateExpression += ` #${element} = :${element},`;
    };

    paramsUpdate.UpdateExpression = paramsUpdate.UpdateExpression.substring(0, paramsUpdate.UpdateExpression.length - 1);
    console.log(paramsUpdate)
    await dynamodb.updateItem(paramsUpdate).promise();

    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify(paramsUpdate),
    };
    return response;

  }
  catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal Server Error'),
    };
  }
};
