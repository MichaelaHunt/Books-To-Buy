const typeDefs = `
    type Book {
        _id: ID!
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Auth {
        token: String!
        user: User!
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String!, link: String!): User
        removeBook(bookId: String!): User
    }
`;

export default typeDefs;