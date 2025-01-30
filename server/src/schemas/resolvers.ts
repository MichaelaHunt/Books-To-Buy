import User from "../models/index.js";
import bookSchema from "../models/Book.js";
import { signToken } from "../utils/auth.js";

interface UserArgs {
    username: string;
}

interface AddUserArgs {
    input:{
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

const resolvers = {
    Query: {
        user: async (_parent: any, { username }: UserArgs) => {
            return User.findOne({ username }).populate('thoughts');
        },
        //login, "save book"?, delete book, 
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });
    
            const token = signToken(user.username, user.email, user._id);
          
            return { token, user };
        },
        login: async (_parent: any, { email, password }: LoginUserArgs) => {

        },
        saveBook: async (_parent: any, { input }: AddUserArgs) => {

        },
        removeBook: async (_parent: any, { input }: AddUserArgs) => {

        }
    }
};

export default resolvers;