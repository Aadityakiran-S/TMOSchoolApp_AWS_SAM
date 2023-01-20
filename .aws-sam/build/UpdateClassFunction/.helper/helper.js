const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function doesEntityExist(entityType, entityID) {
    let body = {};
    // Checking if entity exists
    const params = {
        TableName: SCHOOL_TABLE,
        Key: {
            identifier: `#${entityType}`,
            id: `${entityType}::${entityID}`,
        },
    };
    try {
        body = await dynamoDb.get(params).promise();
    } catch (err) {
        console.log(err);
        body = err.message;
        body.doesEntityExist = false;
        return body;
    } finally {
        //A log to see if item with given key exists
        if (body.Item == undefined || body.Item == null) {
            console.log(`${entityType} with id ${entityType} DNE`);
            body.message = `${entityType} with id ${entityType} DNE`;
            body.doesEntityExist = false;
        }
        else {
            console.log(`${entityType} exists with ID ${entityID}`);
            body.doesEntityExist = true;
        }
    }

    return body;
}

const EntityTypes = Object.freeze({
    student: 'student',
    teacher: 'teacher',
    class: 'class',
});

module.exports = { doesEntityExist, EntityTypes };