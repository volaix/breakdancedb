import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import google from 'next-auth/providers/google'
import Twitter from 'next-auth/providers/twitter'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Twitter, google],
  basePath: '/auth',
})
