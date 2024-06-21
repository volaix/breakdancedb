import dbClientPromise from '@/db/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
// import google from 'next-auth/providers/google'
// import Twitter from 'next-auth/providers/twitter'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(dbClientPromise.connect()),
  providers: [
    GitHub,
    // Twitter,
    // google
  ],
  basePath: '/auth',
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
