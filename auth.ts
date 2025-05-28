import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "@/lib/prisma"
import bcrypt from 'bcrypt';
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
        const { email, password } = await signInSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
            where:{
              email
            }
        })

         if (!user || !user.password) {//these custom errors will be lost as the nextauth will give the generic signin errors
           if (!user) throw new Error("User not found")
          if (!user?.password) throw new Error("User exists but password doesn't, try signing in with google/github")  // when signup happened from some oAuth but signin from custom
        }
        const isPasswordValid= await bcrypt.compare(password, user.password as string)
        if (!isPasswordValid) {
          throw new Error("Wrong Password, impersonator!")
        }
        // return user object with their profile data
        return {
          id:user.id.toString(),
          email:user.email,
          name: user.name
        }
        } catch (error) {
           return  null
        }
        
      },
    }),
  ],
  callbacks:{

    async session({session, token}) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
      }
      return session
    },
    async jwt({token, user}) {
      if (user) {
        token.id = user.id
        token.username = user.name
      }
      return token
    }
  }
})