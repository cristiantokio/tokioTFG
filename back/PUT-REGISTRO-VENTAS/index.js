const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  try {
    let body = JSON.parse(event.body);
    console.log(body);
    if (!body || body === undefined || body == '' ||
      !body.id || body.id === undefined || body.id == '' || body.id == 0) {
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
      "id": {
        S: body.id
      }
    };
    paramsUpdate.ExpressionAttributeNames = {};
    paramsUpdate.ExpressionAttributeValues = {};

    delete body.id;
    for (const element in body) {
      paramsUpdate.ExpressionAttributeNames[`#${element}`] = `${element}`;
      paramsUpdate.ExpressionAttributeValues[`:${element}`] = { S: body[element].toString() };
      paramsUpdate.UpdateExpression += ` #${element} = :${element},`;
    };

    paramsUpdate.UpdateExpression = paramsUpdate.UpdateExpression.substring(0, paramsUpdate.UpdateExpression.length - 1);

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
