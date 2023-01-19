const AWS = require("aws-sdk");
const SCHOOL_TABLE = process.env.SCHOOL_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function doesEntityExist(entityType, entityID) {

    console.log("Entered function");

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
        console.log("entered try");
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

    console.log("Reached the place where we return");
    return body;
}

const EntityTypes = Object.freeze({
    student: 'student',
    teacher: 'teacher',
    class: 'class',
});

module.exports = { doesEntityExist, EntityTypes };