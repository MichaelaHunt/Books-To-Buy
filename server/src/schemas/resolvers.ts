import { User, bookSchema } from "../models/index.js";
import { UserDocument } from "../models/User.js";
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

interface SaveBookArgs {
    input: {
        authors: string[];
        description: string,
        title: string,
        image: string,
        link: string
    }
}

const resolvers = {
    Query: {
        user: async (_parent: any, { username }: UserArgs) => {
            return await User.findOne({ username }).populate('thoughts');
        }
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
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
        saveBook: async (_parent: any, { input }: SaveBookArgs, user: UserDocument) => {
            if (!user) {
                throw new Error("Not signed in.");
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },
        removeBook: async (_parent: any, bookId: string, user: UserDocument) => {
            if (!user) {
                throw new Error("Not signed in.");
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            return updatedUser;
        }
    }
};

export default resolvers;