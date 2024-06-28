const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  try {
    let body = JSON.parse(event.body);
    console.log(body);
    if (!body || body === undefined || body == '' ||
      !body.price || body.price === undefined || body.price == '' || body.price == 0 ||
      !body.product || body.product === undefined || body.product == '' ||
      !body.quantity || body.quantity === undefined || body.quantity == '') {
      return {
        statusCode: 400,
        body: JSON.stringify('Bad Format'),
      };
    }
    const id = generarId();
    let date = new Date();
    let product = {
      id: id,
      price: body.price,
      product: body.product,
      quantity: body.quantity,
      date: date
    }
    console.log(product);

    var params = {
      Item: {
        "id": {
          S: id
        },
        "price": {
          S: body.price.toString()
        },
        "product": {
          S: body.product
        },
        "quantity": {
          S: body.quantity.toString()
        },
        "date": {
          S: date.toString()
        }
      },
      ReturnConsumedCapacity: "TOTAL",
      TableName: process.env.tablename
    };
    await dynamodb.putItem(params).promise();

    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify(product),
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


function generarId() {
  let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 7; i++) {
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return id;
}
