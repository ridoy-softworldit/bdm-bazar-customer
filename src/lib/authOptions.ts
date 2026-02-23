/* eslint-disable @typescript-eslint/no-explicit-any */

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        if (!res.ok) return null;
        const json = await res.json();
        if (!json?.data) return null;

        return {
          id: json.data._id,
          name: json.data.name,
          email: json.data.email,
          role: json.data.role,
          gender: json.data.gender,
          walletPoint: json.data.walletPoint,
          contactNo: json.data.contactNo,
          bio: json.data.bio,
          accessToken: json.data.accessToken || json.accessToken,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async signIn({ user, account }: any) {
      
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/auth/login/provider`;
          const payload = {
            name: user.name,
            email: user.email,
            provider: account.provider,
          };
          
          
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Backend error:', errorText);
            return true;
          }
          
          const json = await res.json();
          console.log('🔍 Provider login response:', json);

          if (json.success && json.data) {
            const dbUser = json.data;
            user.id = dbUser._id;
            user.role = dbUser.role || 'customer';
            user.gender = dbUser.gender;
            user.walletPoint = dbUser.walletPoint || 0;
            user.contactNo = dbUser.contactNo;
            user.bio = dbUser.bio;
            user.accessToken = dbUser.accessToken || json.accessToken;
            return true;
          }
          
          console.error('❌ Response not successful:', json);
          return true;
        } catch (error) {
          console.error('❌ Exception:', error);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.gender = user.gender;
        token.walletPoint = user.walletPoint;
        token.contactNo = user.contactNo;
        token.bio = user.bio;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.gender = token.gender as string;
        session.user.walletPoint = token.walletPoint as number;
        session.user.contactNo = token.contactNo as string;
        session.user.bio = token.bio as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
