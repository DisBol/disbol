import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
    roleId: number;
    clientId: number;
    client_id: number;
    employeeId: number;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      roleId: number;
      clientId: number;
      client_id: number;
      employeeId: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    clientId: number;
    client_id: number;
    employeeId: number;
  }
}
