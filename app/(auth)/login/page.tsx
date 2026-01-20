"use client";

import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-[420px] bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-10">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-9">
          Iniciar Sesión
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}
