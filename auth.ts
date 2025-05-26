import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "./lib/prisma"
export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

  providers: [GitHub, 
    Google,
    Credentials({
      credentials: {
        email: {
      type: "email",
      label: "Email",
      placeholder: "johndoe@gmail.com",
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
    },
      },
      async authorize(credentials) {
        try {
            let user = null
        const { email, password } = await signInSchema.parseAsync(credentials)

        // logic to salt and hash password
        //const pwHash = saltAndHashPassword(credentials.password)
 
        // logic to verify if the user exists
        //user = await getUserFromDb(credentials.email, pwHash)
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
        } catch (error) {
           return  null 
        }
        
      },
    }),
  ],
})