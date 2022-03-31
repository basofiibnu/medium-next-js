import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { client } from '../../../lib/client';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXT_PUBLIC_SECRET_GOOGLE_CLIENT_ID,
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name
        .split(' ')
        .join('')
        .toLocaleLowerCase();
      session.user.id = token.sub;

      const doc = {
        _id: session.user.id,
        _type: 'author',
        googleId: session.user.id,
        name: session.user.name,
        slug: session.user.username,
        image: session.user.image,
      };
      client.createIfNotExists(doc);

      return session;
    },
  },
});
