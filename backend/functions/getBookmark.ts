import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();

const getBookmark = async () => {
    const params = {
        TableName: process.env.BOOKMARK_TABLE || "",
    }
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default getBookmark;