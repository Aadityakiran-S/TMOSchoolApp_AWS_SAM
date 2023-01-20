const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const helper = require("./.helper/helper");

//DONE
exports.createClass = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Item: {
            identifier: "#class",
            id: `class::${uuid.v1()}`,
            className: data.name,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        body = await dynamoDb.put((params)).promise();
        body.message = `Successfully created class with name ${data.name}`;
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
exports.getClass = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: "#class",
            id: `class::${event.pathParameters.id}`,
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
exports.listClasses = async (event, context) => {
    let body = {}; let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    var params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ":identifier": "#class",
            ":id": "class::"
        },
        "ProjectionExpression": "id, className",
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

    return {
        statusCode,
        body,
        headers,
    };
};

//PENDING
exports.updateClass = async (event, context) => {
    const datetime = new Date().toISOString();
    let keys = {}; let body = {}; let params = {}; let requests = {};
    let teacher_class_body = {}; let class_student_body = {}; let inputClassName = "";
    const data = JSON.parse(event.body); let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region  Error Check
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

    //#region Updating class alone mapping
    // params = {
    //     TableName: SCHOOL_TABLE,
    //     Key: {
    //         identifier: "#class",
    //         id: `class::${data.classID}`,
    //     },
    //     ExpressionAttributeValues: {
    //         ":className": data.className,
    //         ":updatedAt": datetime,
    //     },
    //     UpdateExpression:
    //         "set className = :className, updatedAt = :updatedAt",
    //     ReturnValues: "ALL_NEW",
    // };
    // try {
    //     body = await dynamoDb.update(params).promise();
    //     body.message = `Successfully updated class with ID ${data.classID} 
    //     to new name ${data.className}`;
    // } catch (error) {
    //     statusCode = 400;
    //     body = error.message;
    //     console.log(error);
    // } finally {
    //     console.log(body);
    // }
    //#endregion

    //#region  Updating teacher-class mapping
    //Fetching all keys of teacher-class mapping 
    // params = {
    //     TableName: SCHOOL_TABLE,
    //     IndexName: 'class_id_to_teacher_id_gsi',
    //     ExpressionAttributeValues: {
    //         ':gsi_key': `class::${data.classID}`,
    //         ':identifier': 'teacher::'
    //     },
    //     KeyConditionExpression:
    //         'class_id_gsi = :gsi_key AND begins_with(identifier, :identifier)',
    //     // ProjectionExpression: 'identifier, id, className, teacherName',
    // };

    // try {
    //     body = await dynamoDb.query((params)).promise();
    // } catch (err) {
    //     statusCode = 400;
    //     body = err.message;
    //     console.log(`err at 208 ${err}`);
    // } finally {
    //     keys = body.Items.map(item => [item.identifier, item.id]);
    //     console.log(`finally at 211 ${keys}`);
    // }

    // // // //Updating all entries with keys from teacher-class mapping using batchWrite
    // requests = keys.map((item) => ({
    //     UpdateRequest: {
    //         Key: {
    //             identifier: item[0],
    //             id: item[1]
    //         },
    //         UpdateExpression:
    //             "SET className = :className, updatedAt = :updatedAt",
    //         ExpressionAttributeValues: {
    //             ":className": data.className,
    //             ":updatedAt": datetime
    //         },
    //         ReturnValues: "UPDATED_NEW"
    //     }
    // }));

    // params = {
    //     RequestItems: {
    //         [SCHOOL_TABLE]: requests
    //     }
    // };

    // try {
    //     teacher_class_body = await dynamoDb.batchWrite((params)).promise();
    // } catch (err) {
    //     statusCode = 400;
    //     teacher_class_body = err.message;
    //     console.log(`err at 242 ${err}`);
    // } finally {
    //     console.log(teacher_class_body);
    // }
    //#endregion

    //#region  Updating class-student mapping
    //Fetching all keys of class-student mapping 
    // params = {
    //     TableName: SCHOOL_TABLE,
    //     ExpressionAttributeValues: {
    //         ':identifier': `class::${data.classID}`,
    //         ':id': 'student::'
    //     },
    //     KeyConditionExpression:
    //         'identifier = :identifier AND begins_with(id, :id)',
    //     ProjectionExpression: 'identifier, id, studentName, className',
    // };

    // try {
    //     body = await dynamoDb.query((params)).promise();
    // } catch (err) {
    //     statusCode = 400;
    //     body = err.message;
    //     console.log(err);
    // } finally {
    //     keys = body.Items.map(item => [item.identifier, item.id]);
    //     console.log(keys);
    // }

    // // //Updating all entries with keys from teacher-class mapping using batchWrite
    // requests = keys.map((item) => ({
    //     UpdateRequest: {
    //         Key: {
    //             identifier: item[0],
    //             id: item[1]
    //         },
    //         UpdateExpression:
    //             "SET className = :className, updatedAt = :updatedAt",
    //         ExpressionAttributeValues: {
    //             ":className": data.className,
    //             ":updatedAt": datetime
    //         },
    //         ReturnValues: "UPDATED_NEW"
    //     }
    // }));

    // params = {
    //     RequestItems: {
    //         [SCHOOL_TABLE]: requests
    //     }
    // };

    // try {
    //     class_student_body = await dynamoDb.batchWrite((params)).promise();
    // } catch (err) {
    //     statusCode = 400;
    //     class_student_body = err.message;
    //     console.log(err);
    // } finally {
    //     console.log(class_student_body);
    // }
    //#endregion

    body = `Successfully updated className from ${inputClassName} to ${data.className}`
    return {
        statusCode,
        body: JSON.stringify(body),
        // teacher_class_body : JSON.stringify(teacher_class_body),
        // class_student_body: JSON.stringify(class_student_body),
        headers,
    };
};

//DONE
exports.deleteClass = async (event, context) => {
    let keys = {}; let body = {}; let params = {}; let requests = {};
    let inputClassName = ""; let teacher_class_body = {}; let class_student_body = {};
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    //#region Deleting class alone mapping
    body = await helper.doesEntityExist(helper.EntityTypes.class, event.pathParameters.id);
    //If given class DNE
    if (body.doesEntityExist === false) {
        body.message = `class with ID ${event.pathParameters.id} DNE`;
        statusCode = 400;
        return {
            statusCode,
            body: JSON.stringify(body),
            headers
        };
    }
    else {
        inputClassName = body.Item.className;
        params = {
            TableName: SCHOOL_TABLE,
            Key: {
                identifier: "#class",
                id: `class::${event.pathParameters.id}`,
            },
        };
        try {
            body = await dynamoDb.delete(params).promise();
        } catch (err) {
            statusCode = 400;
            body = err.message;
            console.log(err);
        }
    }
    //#endregion

    //#region  Deleting teacher-class mapping
    //Fetching all keys of teacher-class mapping 
    params = {
        TableName: SCHOOL_TABLE,
        IndexName: 'class_id_to_teacher_id_gsi',
        ExpressionAttributeValues: {
            ':gsi_key': `class::${event.pathParameters.id}`,
            ':identifier': 'teacher::'
        },
        KeyConditionExpression:
            'class_id_gsi = :gsi_key AND begins_with(identifier, :identifier)',
        ProjectionExpression: 'identifier, id, teacherName, className',
    };
    try {
        body = await dynamoDb.query((params)).promise();
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        if (body.ScannedCount == 0) {
            console.log(`No teachers are assigned to class with name ${inputClassName}`);
        }
        else { //TODO: Make this into a function
            keys = body.Items.map(item => [item.identifier, item.id]);
            console.log(keys);

            // //Deleting all entries with keys from teacher-class mapping
            teacher_class_body = await helper.performBatchDeleteOperation(keys);
            console.log(JSON.stringify(teacher_class_body));
        }
    }
    //#endregion

    //#region  Deleting class-student mapping
    //Fetching all keys of class-student mapping 
    params = {
        TableName: SCHOOL_TABLE,
        ExpressionAttributeValues: {
            ':identifier': `class::${event.pathParameters.id}`,
            ':id': 'student::'
        },
        KeyConditionExpression:
            'identifier = :identifier AND begins_with(id, :id)',
        ProjectionExpression: 'identifier, id, studentName, className',
    };
    try {
        body = await dynamoDb.query((params)).promise();
    } catch (err) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        if (body.ScannedCount == 0) {
            console.log(`No students are assigned to class with name ${inputClassName}`);
        }
        else {
            keys = body.Items.map(item => [item.identifier, item.id]);
            console.log(keys);

            // //Deleting all entries with keys from class-student mapping
            class_student_body = await helper.performBatchDeleteOperation(keys);
            console.log(JSON.stringify(class_student_body));
        }
        //#endregion

        body.message = `Successfully deleted class with name ${inputClassName} and all associated entries`;
        return {
            statusCode,
            body: JSON.stringify(body),
            headers,
        };
    };
}