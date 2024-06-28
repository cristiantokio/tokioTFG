const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

const headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      };

exports.handler = async (event) => {

  console.log(JSON.stringify(event));
  const params = {
    TableName: process.env.tablename, // Reemplaza 'NOMBRE_DE_LA_TABLA' con el nombre de tu tabla DynamoDB
    Limit: 10 // Limita la cantidad de elementos a 10
  };

  try {
    const data = await dynamodb.scan(params).promise();
    const dataItems = [];
    data.Items.forEach(item=>{
      let product = {};
      product.product = item.product.S;
      product.quantity = item.quantity.S;
      product.date = item.date.S;
      product.id = item.id.S;
      product.price = item.price.S;
      dataItems.push(product);
    })
    
    // TODO implement
    const response = {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(dataItems),
    };
    return response;
  }
  catch (e) {
    console.log(e);
    return {
      headers: headers,
      statusCode: 500,
      body: JSON.stringify('Internal Server Error'),
    };
  }
};
