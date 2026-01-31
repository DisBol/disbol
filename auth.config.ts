import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface CustomUser {
  id: string;
  username: string;
  role: string;
  roleId: number;
  clientId: number;
  employeeId: number;
}

interface CustomSession {
  user: {
    id: string;
    username: string;
    role: string;
    roleId: number;
    clientId: number;
    employeeId: number;
  };
}

const API_URL = "https://clgqxx5idk.g4.sqlite.cloud:443/v2/functions/loginuser";
const API_TOKEN = "sQZHtQhFSbz12LU5VoVWKiHPt3f4ECue92TUWez9hMc";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const result = await response.json();

          if (!result.data || result.data.length === 0) {
            return null;
          }

          const userData = result.data[0];

          return {
            id: userData.id.toString(),
            username: userData.username,
            role: userData.Role_name,
            roleId: userData.Role_id,
            clientId: userData.Client_id,
            employeeId: userData.Employee_id,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = user.id;
        token.username = customUser.username;
        token.role = customUser.role;
        token.roleId = customUser.roleId;
        token.clientId = customUser.clientId;
        token.employeeId = customUser.employeeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const customSession = session as CustomSession;
        customSession.user.id = token.id as string;
        customSession.user.username = token.username as string;
        customSession.user.role = token.role as string;
        customSession.user.roleId = token.roleId as number;
        customSession.user.clientId = token.clientId as number;
        customSession.user.employeeId = token.employeeId as number;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
