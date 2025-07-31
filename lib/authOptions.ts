import { connectToDatabase } from "@/db/db";
import { hashPassword } from "@/utils/hash";
import { NextAuthOptions } from "next-auth";
import UsersDb from "@/db/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
   session: {
      strategy: "jwt"
   },
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
      CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {}
			},
         async authorize (credentials, req) {
            if (credentials?.email == "" || credentials?.password == "") {
               return null;
            } else {
               await connectToDatabase();
               const result = await UsersDb.findOne({
                  email: credentials?.email,
                  password: hashPassword(credentials?.password!)
               })
               if (result !== false && typeof result !== "boolean") {
                  return {
                     id: result.userid,
                     email: result.email,
                     name: result.name,
                     image: result.image
                  }	
               } else {
                  return null;
               }
            }
         }
      }) 
   ],
	callbacks: {
      async signIn({ user, account, profile }) {
         await connectToDatabase();
         const existingUser = await UsersDb.findOne({ email: user.email });
         if (!existingUser) return false; // Do not allow sign in
         return true; // Allow sign in
      },
		jwt: async ({ user, token, trigger, session }) => {
			if (trigger == "update") {
				return { ...token, ...session.user }
			}
			return { ...token, ...user }
		}
	}
}