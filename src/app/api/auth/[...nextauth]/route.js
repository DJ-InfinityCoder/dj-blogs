import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import ConnectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await ConnectDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user) throw new Error("User not found");
                if (!user.isVerified) throw new Error("Email not verified. Check your inbox.");

                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) throw new Error("Invalid credentials");

                return { id: user._id, email: user.email, name: user.name, image: user.image };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
                await ConnectDB();

                let user = await User.findOne({ email: profile.email });
                if (!user) {
                    user = new User({
                        provider: "google",
                        providerId: profile.sub,
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture,
                        emailVerified: profile.email_verified,
                        isVerified: true,
                    });
                    await user.save();
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            async profile(profile) {
                await ConnectDB();

                let user = await User.findOne({ email: profile.email });
                if (!user) {
                    user = new User({
                        provider: "github",
                        providerId: profile.id,
                        email: profile.email,
                        name: profile.name || profile.login,
                        image: profile.avatar_url,
                        username: profile.login,
                        bio: profile.bio,
                        location: profile.location,
                        company: profile.company,
                        website: profile.blog,
                        emailVerified: true,
                        isVerified: true,
                    });
                    await user.save();
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        updateAge: 24 * 60 * 60,
    },

    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                
                await ConnectDB();
                const existingUser = await User.findOne({ email: user.email });
                if (existingUser) {
                    token.id = existingUser._id.toString(); 
                }
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.image = token.image;
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
        signOut: "/auth/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST };
