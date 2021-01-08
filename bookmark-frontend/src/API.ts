/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type InputBookmark = {
  id: string,
  url: string,
  desc: string,
};

export type AddBookmarkMutationVariables = {
  bookmark?: InputBookmark | null,
};

export type AddBookmarkMutation = {
  addBookmark:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    desc: string,
  } | null,
};

export type DeleteBookmarkMutationVariables = {
  bookmarkId: string,
};

export type DeleteBookmarkMutation = {
  deleteBookmark: string | null,
};

export type GetBookmarkQuery = {
  getBookmark:  Array< {
    __typename: "Bookmark",
    id: string,
    url: string,
    desc: string,
  } > | null,
};
