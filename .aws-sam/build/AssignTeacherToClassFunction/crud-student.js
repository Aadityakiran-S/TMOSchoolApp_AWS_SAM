const AWS = require("aws-sdk");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const {"v4": uuidv4} = require('uuid');
let response;

exports.createStudent = async (event, context) => {
    // try {
    //     // const ret = await axios(url);
    //     response = {
    //         'statusCode': 200,
    //         'body': JSON.stringify({
    //             message: 'hello world'
    //             // location: ret.data.trim()
    //         })
    //     }
    // } catch (err) {
    //     console.log(err);
    //     return err;
    // }

    // return response;
    return JSON.stringify(event.queryStringParameters.foo);
};

exports.getStudent = async (event, context) => {
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

exports.updateStudent = async (event, context) => {
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

exports.deleteStudent = async (event, context) => {
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
