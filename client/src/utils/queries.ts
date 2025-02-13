import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    user {
        _id
        username
        email
        bookCount
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
      _id
      email
      username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
      _id
      email
      username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: SaveBookArgs) {
    saveBook(input: $input) {
      user {
      _id
      email
      username
      }
    }
  } 
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      user {
      _id
      email
      username
      }
    }
  }
`;