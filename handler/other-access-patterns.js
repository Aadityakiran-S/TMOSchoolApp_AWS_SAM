const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//DONE
exports.assignStudentToClass = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    let params = {};
    let inputStudentName; let inputClassName;
    // Checking if student exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#student",
            id: `student::${data.studentID}`,
        },
        "ProjectionExpression": "id, studentName",
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
            statusCode = 400;
            return {
                statusCode,
                body: JSON.stringify(body),
                headers
            };
        }
        else {
            inputStudentName = body.Item.studentName;
        }
    }

    //Checking if class exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${data.classID}`,
        },
        "ProjectionExpression": "id, className",
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
            statusCode = 400;
            return {
                statusCode,
                body: JSON.stringify(body),
                headers
            };
        }
        else {
            inputClassName = body.Item.className;
        }
    }
    //#endregion

    //Actually enrolling student in class
    params = {
        TableName: SCHOOL_TABLE,
        Item: {
            identifier: `class::${data.classID}`,
            id: `student::${data.studentID}`,
            student_id_gsi: `student::${data.studentID}`,
            studentName: inputStudentName,
            className: inputClassName,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully enrolled student ${inputStudentName} in ${inputClassName} class`;
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    }
    finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};

//DONE
exports.removeStudentFromClass = async (event, context) => {
    let body = {}; let statusCode = 200;
    const data = JSON.parse(event.body);
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    let params = {};
    let inputStudentName; let inputClassName;
    // Checking if student exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#student",
            id: `student::${data.studentID}`,
        },
        "ProjectionExpression": "id, studentName",
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
            statusCode = 400;
            return {
                statusCode,
                body: JSON.stringify(body),
                headers
            };
        }
        else {
            inputStudentName = body.Item.studentName;
        }
    }

    //Checking if class exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${data.classID}`,
        },
        "ProjectionExpression": "id, className",
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
            statusCode = 400;
            return {
                statusCode,
                body: JSON.stringify(body),
                headers
            };
        }
        else {
            inputClassName = body.Item.className;
        }
    }
    //#endregion

    //Actually removing student from class
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: `class::${data.classID}`,
            id: `student::${data.studentID}`,
        },
    };

    try {
        body = await dynamoDb.delete(params).promise();
        body.message = `Successfully removed student ${inputStudentName} from ${inputClassName} class`;
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

//DONE
exports.assignTeacherToClass = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    let params = {};
    let inputTeacherName; let inputClassName;
    //Checking if teacher exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${data.teacherID}`,
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
        else {
            inputTeacherName = body.Item.teacherName;
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
        else {
            inputClassName = body.Item.className;
        }
    }
    //#endregion

    //Actually assigning teacher to class
    params = {
        TableName: SCHOOL_TABLE,
        Item: {
            identifier: `teacher::${data.teacherID}`,
            id: `class::${data.classID}`,
            class_id_gsi: `class::${data.classID}`,
            className: inputClassName,
            teacherName: inputTeacherName,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully assigned teacher ${inputTeacherName} to ${inputClassName} class`;
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
exports.removeTeacherFromClass = async (event, context) => {
    let body = {}; let statusCode = 200;
    const data = JSON.parse(event.body);
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    let params = {};
    let inputTeacherName; let inputClassName;
    //Checking if teacher exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${data.teacherID}`,
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
        else {
            inputTeacherName = body.Item.teacherName;
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
        else {
            inputClassName = body.Item.className;
        }
    }
    //#endregion

    //Actually removing teacher from class
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: `teacher::${data.teacherID}`,
            id: `class::${data.classID}`,
        },
    };

    try {
        body = await dynamoDb.delete(params).promise();
        body.message = `Successfully removed teacher ${inputTeacherName} from ${inputClassName} class`;
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

//DONE
exports.listAllStudentsInClass = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    let params = {};
    let inputClassName;
    //Checking if class exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${event.pathParameters.id}`,
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
            body.message = `Class with id ${event.pathParameters.id} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
        else {
            inputClassName = body.Item.className;
        }
    }
    //#endregion

    //Actually doing the listing
    params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier": `class::${event.pathParameters.id}`,
            ":id": "student::"
        },
        KeyConditionExpression: 'identifier = :identifier AND begins_with(id, :id)',
        ProjectionExpression: "studentName",
    };

    try {
        body = await dynamoDb.query(params).promise();
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body.message = `All students in ${inputClassName} are...`
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

//DONE
exports.listAllClassByTeacher = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
    let params = {};
    let inputTeacherName;
    //Checking if teacher exists
    params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#teacher",
            id: `teacher::${event.pathParameters.id}`,
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
            body.message = `Teacher with id ${event.pathParameters.id} DNE`;
            body = JSON.stringify(body);
            return {
                statusCode,
                body,
                headers
            };
        }
        else {
            inputTeacherName = body.Item.teacherName;
        }
    }
    //#endregion

    //Actually doing the listing
    params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier": `teacher::${event.pathParameters.id}`,
            ":id": "class::"
        },
        KeyConditionExpression: 'identifier = :identifier AND begins_with(id, :id)',
        ProjectionExpression: "teacherName",
    };

    try {
        body = await dynamoDb.query(params).promise();
        console.log(body);
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body.message = `All classes taken by ${inputTeacherName} are...`
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

//DONE
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