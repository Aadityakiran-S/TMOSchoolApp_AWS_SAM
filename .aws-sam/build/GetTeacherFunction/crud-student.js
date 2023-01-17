const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

//DONE: Working
exports.createStudent = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Item: {
            identifier: "#student",
            id: `student::${uuid.v1()}`,
            studentName: data.name,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully created student with name ${data.name}`;
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

//DONE: Working
exports.getStudent = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#student",
            id: `student::${event.pathParameters.id}`,
        },
        "ProjectionExpression": "studentName", 
    };

    try {
        body = await dynamoDb.get(params).promise();
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        //A log to see if item with given key exists
        if (body.Item == undefined || body.Item == null) {
            body.message = `Item with id ${event.pathParameters.id} DNE`;
        }
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

//DONE: Working
exports.listStudents = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    var params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier" : "#student",
            ":id" : "student::"
        },
        "ProjectionExpression": "id, studentName", 
        KeyConditionExpression: 'identifier = :identifier AND begins_with(id, :id)',
    };

    try {
        body = await dynamoDb.query(params).promise();
        console.log(body);
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    console.log(body);

    return {
        statusCode,
        body,
        headers,
    };
};

exports.updateStudent = async (event, context) => {
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
            "set studentName = :name, updatedAt = :updatedAt",
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

exports.deleteStudent = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#student",
            id: `student::${event.pathParameters.id}`,
        },
    };

    try {
        body = await dynamoDb.delete(params).promise();
        body.message = `Successfully deleted student with ID ${event.pathParameters.id}`;
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
