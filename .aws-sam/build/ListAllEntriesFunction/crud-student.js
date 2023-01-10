const AWS = require("aws-sdk");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { "v4": uuid } = require('uuid');

exports.createStudent = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log(data);
    data["message"] = "Successfully done whatever";

    //Passing ID if passed to function
    try{
        data.id = event.pathParameters.id;
    }
    catch(err){
        console.log(err);
    }

    let body;
    let statusCode = 200;

    try {
        body = data;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    const output = {
        statusCode,
        body,
    }

    return output;
};

exports.getStudent = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log(data);
    data["message"] = "Successfully done whatever";

    //Passing ID if passed to function
    try{
        data.id = event.pathParameters.id;
    }
    catch(err){
        console.log(err);
    }

    let body;
    let statusCode = 200;

    try {
        body = data;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    const output = {
        statusCode,
        body,
    }

    return output;
};

exports.updateStudent = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log(data);
    data["message"] = "Successfully done whatever";

    //Passing ID if passed to function
    try{
        data.id = event.pathParameters.id;
    }
    catch(err){
        console.log(err);
    }

    let body;
    let statusCode = 200;

    try {
        body = data;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    const output = {
        statusCode,
        body,
    }

    return output;
};

exports.deleteStudent = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log(data);
    data["message"] = "Successfully done whatever";

    //Passing ID if passed to function
    try{
        data.id = event.pathParameters.id;
    }
    catch(err){
        console.log(err);
    }

    let body;
    let statusCode = 200;

    try {
        body = data;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    const output = {
        statusCode,
        body,
    }

    return output;
};
