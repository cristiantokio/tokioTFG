const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  try {
    let body = JSON.parse(event.body);
    console.log(body);
    if (!body || body === undefined || body == '' ||
      !body.email || body.email === undefined || body.email == '' ||
      !body.psw || body.psw === undefined || body.psw == '' ||
      !body.rol || body.rol === undefined || body.rol == '') {
      return {
        statusCode: 400,
        body: JSON.stringify('Bad Format'),
      };
    }
    let date = new Date().toISOString().split('T')[0].replaceAll('-', '/');
    let user = {
      user: body.email,
      fecha_creacion: date,
      psw: body.psw,
      rol: body.rol,
      token: '',
      ultima_sesion: ''
    }
    console.log(user);

    var params = {
      Item: {
        "user": {
          S: user.user
        },
        "fecha_creacion": {
          S: user.fecha_creacion
        },
        "psw": {
          S: user.psw
        },
        "rol": {
          S: user.rol
        },
        "token": {
          S: user.token
        },
        "ultima_sesion": {
          S: user.ultima_sesion
        },
      },
      ReturnConsumedCapacity: "TOTAL",
      TableName: process.env.tablename
    };
    console.log(params)
    await dynamodb.putItem(params).promise();

    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify(user),
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
