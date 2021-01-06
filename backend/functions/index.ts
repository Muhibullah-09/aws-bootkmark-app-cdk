import addBookmark from './addBookmark';
import getBookmark from './getBookmark';
import deleteBookmark from './deleteBookmark';
import Bookmark from './bookmark';

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        bookmarkId: string,
        bookmark: Bookmark
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "addBookmark":
            return await addBookmark(event.arguments.bookmark);
        case "getBookmark":
            return await getBookmark();
        case "deleteBookmark":
            return await deleteBookmark(event.arguments.bookmarkId);
        default:
            return null;
    }
}