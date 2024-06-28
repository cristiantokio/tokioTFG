const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const dynamodb = new AWS.DynamoDB();

const headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      };

exports.handler = async (event) => {
  console.log(event);
  try {
    let user = event.queryStringParameters.user;
    let psw = event.queryStringParameters.psw;

    if ((!user || user == '') || (!psw || psw == '')) {
      return {
        statusCode: 403,
        body: JSON.stringify('Forbidden'),
      };
    }
    let params = {
      Key: {
        "user": {
          S: user
        }
      },
      TableName: process.env.tablename
    };
    let res = await dynamodb.getItem(params).promise();

    if (Object.keys(res).length === 0 || res.Item.psw.S !== psw) {
      return {
        headers: headers,
        statusCode: 403,
        body: JSON.stringify('Forbidden'),
      };
    }
    console.log(res);
    let userToken = {
      "username": res.Item.user.S,
      "password": res.Item.psw.S,
    }
    let token = jwt.sign({
      userToken
    }, 'secret');

    console.log(token);
    res.Item.token.S = token;
    
    let date = obtenerFechaFormateada();

    var paramsUpdate = {
      ExpressionAttributeNames: {
        "#TK": "token",
        "#DT": "ultima_sesion"
      },
      ExpressionAttributeValues: {
        ":tk": {
          S: token
        },
        ":dt": {
          S: date
        }
      },
      Key: {
        "user": {
          S: user
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: process.env.tablename,
      UpdateExpression: "SET #TK = :tk, #DT = :dt"
    };
    await dynamodb.updateItem(paramsUpdate).promise();


    // TODO implement
    const response = {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify({
        user: res.Item.user.S,
        token: token
      }),
    };
    return response;
  }
  catch (e) {
    console.log('Error: ' + JSON.stringify(e));
    return {
      headers: headers,
      statusCode: 500,
      body: JSON.stringify('Internal Server Error'),
    };
  }

};


function obtenerFechaFormateada() {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const day = String(fechaActual.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}