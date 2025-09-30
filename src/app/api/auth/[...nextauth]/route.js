import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/lib/db";


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const user = await executeQuery("SELECT * FROM users WHERE email = ?", [credentials.email]);
                const userData = user[0];
                //console.log("userData", userData);
                if (userData && await bcrypt.compare(credentials.password, userData.password)) {
                    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "vapeMarina", { expiresIn: '1h' });
                    return { ...userData, token };
                } else {
                    return null;
                }
            },
        }),
    ],
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.role = token.role;
            return session;
        },
    },
    secret: "vapeMarina",
});

export { handler as GET, handler as POST };
