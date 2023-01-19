const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

//DONE
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
            identifier: "#teacher",
            id: `teacher::${uuid.v1()}`,
            teacherName: data.name,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully created teacher with name ${data.name}`;
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

//DONE
exports.getTeacher = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${event.pathParameters.id}`,
        },
        "ProjectionExpression": "teacherName", 
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

//DONE
exports.listTeachers = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    var params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier" : "#teacher",
            ":id" : "teacher::"
        },
        "ProjectionExpression": "id, teacherName", 
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

//PENDING
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
            "set teacherName = :name, updatedAt = :updatedAt",
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

//NEED TO CHECK
exports.deleteTeacher = async (event, context) => {
    let keys = {}; let body = {}; let params = {}; let requests = {};
    let inputTeacherName = ""; let teacher_class_body = {};
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${event.pathParameters.id}`,
        },
        "ProjectionExpression": "id, teacherName",
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
            body.message = `Teacher with id ${event.pathParameters.id} DNE`;
            statusCode = 400;
            return {
                statusCode,
                body: JSON.stringify(body),
                headers
            };
        }
        else {
            inputTeacherName = body.Item.teacherName;
        }
    }
    //#endregion

    //#region Deleting teacher alone mapping
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${event.pathParameters.id}`,
        },
    };

    try {
        body = await dynamoDb.delete(params).promise();
        body.message1 = `Successfully deleted teacher along param with ID ${event.pathParameters.id}`;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        console.log(body);
    }
    //#endregion

    //#region  Deleting teacher-class mapping
    //Fetching all keys of class-student mapping 
    params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ':identifier': `teacher::${event.pathParameters.id}`,
            ':id': 'class::'
        },
        KeyConditionExpression:
            'identifier = :identifier AND begins_with(id, :id)',
        ProjectionExpression: 'identifier, id, teacherName, className',
    };

    try {
        body = await dynamoDb.query((params)).promise();
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        keys = body.Items.map(item => [item.identifier, item.id]);
        console.log(keys);
    }

    // //Deleting all entries with keys from teacher-class mapping
    requests = keys.map((item) => ({
        DeleteRequest: {
            Key: {
                identifier: item[0],
                id: item[1]
            }
        }
    }));

    params = {
        RequestItems: {
            [SCHOOL_TABLE]: requests
        }
    };

    try {
        teacher_class_body = await dynamoDb.batchWrite((params)).promise();
    } catch (err) {
        statusCode = 400;
        teacher_class_body = err.message;
        console.log(err);
    } finally {
        JSON.stringify(teacher_class_body);
        console.log(teacher_class_body);
    }
    //#endregion

    body.message = `Successfully deleted class with name ${inputTeacherName} and all associated entries`;
    return {
        statusCode,
        body: JSON.stringify(body),
        headers,
    };
};
