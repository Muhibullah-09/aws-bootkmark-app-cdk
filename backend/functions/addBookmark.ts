import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();
import Bookmark from './bookmark';

const addBookmark = async(bookmark: Bookmark) => {
    const params = {
        TableName: process.env.BOOKMARK_TABLE || "",
        Item: bookmark
    }
    try {
        await docClient.put(params).promise();
        return bookmark;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default addBookmark;