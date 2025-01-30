import { createUser } from "../controllers/user-controller.js";
import { User, bookSchema } from "../models/index.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

interface UserArgs {
    username: string;
}

interface AddUserArgs {
    input: {
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
            return await User.findOne({ username }).populate('thoughts');
        }
    },
    Mutation: {
        createUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        saveBook: async (_parent: any, { input }: AddUserArgs) => {

        },
        removeBook: async (_parent: any, { input }: AddUserArgs) => {

        }
    }
};

export default resolvers;