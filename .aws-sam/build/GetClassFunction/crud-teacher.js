const AWS = require("aws-sdk");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { "v4": uuid } = require('uuid');

exports.createTeacher = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Item: {
            id: uuid.v1(),
            entryName: data.name,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully created item with namne ${data.name}`;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};

exports.getTeacher = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    try {
        body = await dynamoDb.get(params).promise();
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

exports.updateTeacher = async (event, context) => {
    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
            ":name": data.name,
            ":updatedAt": datetime,
        },
        UpdateExpression:
            "set entryName = :name, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW",
    };


    try {
        body = await dynamoDb.update(params).promise();
        body.message = `Successfully updated item with ID ${event.pathParameters.id}`;
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

exports.deleteTeacher = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    try {
        body = await dynamoDb.delete(params).promise();
        body.message = `Successfully deleted item with ID ${event.pathParameters.id}`;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
