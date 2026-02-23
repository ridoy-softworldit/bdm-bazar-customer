import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    gender?: string;
    walletPoint?: number;
    contactNo?: string;
    bio?: string;
    accessToken?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role?: string;
    gender?: string;
    walletPoint?: number;
    contactNo?: string;
    bio?: string;
    accessToken?: string;
  }
}
