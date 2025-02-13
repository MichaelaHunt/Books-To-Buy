import { User } from "../models/index.js";
import { UserDocument } from "../models/User.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

interface UserArgs {
    username: string;
    id: number;
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
        me: async (_parent: any, { username, id }: UserArgs) => {
            const foundUser = await User.findOne({ _id: id }, { username });
            if (!foundUser) {
                throw new Error("Could not find user.");
            }
            return foundUser;
        },
    },
    Mutation: {
        addUser: async (_parent: any, { username, email, password }: {username: string; email: string; password: string}) => {
            const user = await User.create({username, email, password});

            const token = signToken(user.username, user.email, String(user._id));

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