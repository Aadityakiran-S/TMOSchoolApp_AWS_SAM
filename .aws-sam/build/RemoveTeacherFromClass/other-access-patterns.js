const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.enrollStudentToClass = async (event, context) => {
    const timestamp = new Date().getTime(); 
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    let params = {};
    //Checking if student exists
    // params = {
    //     TableName: SCHOOL_TABLE,
    //     Key: {
    //         identifier: "#student",
    //         id: `student::${data.studentID}`,
    //     },
    // };
    // try {
    //     body = await dynamoDb.get(params).promise();
    // } catch (err) {
    //     statusCode = 400;
    //     body = err.message;
    //     console.log(err);
    // } finally {
    //     //A log to see if item with given key exists
    //     if (body.Item == undefined || body.Item == null) {
    //         body.message = `Student with id ${data.studentID} DNE`;
    //         statusCode = 400;
    //         body = JSON.stringify(body);
    //         return {
    //             statusCode,
    //             body,
    //             headers
    //         };
    //     }
    // }

    // //Checking if class exists
    // params = {
    //     TableName: SCHOOL_TABLE,
    //     Key: {
    //         identifier: "#class",
    //         id: `class::${data.classID}`,
    //     },
    // };
    // try {
    //     body = await dynamoDb.get(params).promise();
    // } catch (err) {
    //     statusCode = 400;
    //     body = err.message;
    //     console.log(err);
    // } finally {
    //     //A log to see if item with given key exists
    //     if (body.Item == undefined || body.Item == null) {
    //         body.message = `Class with id ${data.classID} DNE`;
    //         statusCode = 400;
    //         body = JSON.stringify(body);
    //         return {
    //             statusCode,
    //             body,
    //             headers
    //         };
    //     }
    // }

    //Actually enrolling student in class
    params = {
        TableName: SCHOOL_TABLE,
        Item: {
            identifier: `class::${data.classID}`,
            id: `student::${data.studentID}`,
            student_id_gsi: `student::${data.studentID}`,
            studentName: data.studentName,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully enrolled student in class`;
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

exports.removeStudentFromClass = async (event, context) => {
    let body = {}; let statusCode = 200; 
    const headers = {
        "Content-Type": "application/json",
    };

    let params = {};
    //Checking if student exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#student",
            id: `student::${data.studentID}`,
        },
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
            body.message = `Student with id ${data.studentID} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
    }

    //Checking if class exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${data.classID}`,
        },
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
            body.message = `Class with id ${data.classID} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
    }

    //Actually removing student from class
    params = {
        TableName: SCHOOL_TABLE,
        Item: {
            student_id_gsi: `student::${data.studentID}`,
            identifier: `class::${data.classID}`,
        },
    };

    try {
        body = await dynamoDb.delete(params).promise();
        body.message = `Successfully deleted student from class`;
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

exports.assignTeacherToClass = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    let params = {};
    //Checking if teacher exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${data.studentID}`,
        },
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
            body.message = `Teacher with id ${data.teacherID} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
    }

    //Checking if class exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${data.classID}`,
        },
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
            body.message = `Class with id ${data.classID} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
    }

    //Actually assigning teacher to class
    params = {
        TableName: SCHOOL_TABLE,
        Item: {
            identifier: `teacher::${data.teacherID}`,
            id: `class::${data.classID}`,
            class_id_gsi: `class::${data.classID}`,
            studentName: data.className,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully enrolled student in class`;
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

exports.removeTeacherFromClass = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    let params = {};
    //Checking if teacher exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${data.studentID}`,
        },
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
            body.message = `Teacher with id ${data.teacherID} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
    }

    //Checking if class exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${data.classID}`,
        },
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
            body.message = `Class with id ${data.classID} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
    }

    params = {
        TableName: SCHOOL_TABLE,
        Item: {
            class_id_gsi: `class::${data.classID}`,
            identifier: `teacher::${data.teacherID}`,
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

exports.listAllStudentsInClass = async (event, context) => {
    let body = {}; let statusCode = 200;
    const data = JSON.parse(event.body);
    const headers = {
        "Content-Type": "application/json",
    };

    var params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier": `class::${data.classID}`,
            ":id": "student::"
        },
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

exports.listAllClassByTeacher = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    var params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier": `teacher::${event.pathParameters.id}`,
            ":id": "class::"
        },
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