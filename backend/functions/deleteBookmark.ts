import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();

const deleteBookmark = async (bookmarkId: string) => {
    const params = {
        TableName: process.env.BOOKMARK_TABLE || "",
        Key: { id: bookmarkId }
    }
    try {
        await docClient.delete(params).promise()
        return bookmarkId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteBookmark;