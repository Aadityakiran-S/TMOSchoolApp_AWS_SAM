const AWS = require("aws-sdk");

const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { "v4": uuid } = require('uuid');

exports.enrollStudentToClass = async (event, context) => {
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

exports.assignTeacherToClass = async (event, context) => {
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

exports.listAllStudentsInClass = async (event, context) => {
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

exports.listAllClassByTeacher = async (event, context) => {
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

exports.listAllEntries = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
      TableName: SCHOOL_TABLE,
    };
    try {
      body = await dynamoDb.scan(params).promise();
    } catch (error) {
      statusCode = 400;
      body = error.message;
      console.log(error);
    } finally {
      body = JSON.stringify(body);
    }
  
    return {
      statusCode,
      body,
      headers,
    };
  };