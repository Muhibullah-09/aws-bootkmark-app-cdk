/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addBookmark = /* GraphQL */ `
  mutation AddBookmark($bookmark: InputBookmark) {
    addBookmark(bookmark: $bookmark) {
      id
      url
      desc
    }
  }
`;
export const deleteBookmark = /* GraphQL */ `
  mutation DeleteBookmark($bookmarkId: String!) {
    deleteBookmark(bookmarkId: $bookmarkId)
  }
`;
