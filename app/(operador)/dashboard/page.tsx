import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>

        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {session.user.id}
          </p>
          <p>
            <strong>Usuario:</strong> {session.user.username}
          </p>
          <p>
            <strong>Rol:</strong> {session.user.role}
          </p>
          <p>
            <strong>Client ID:</strong> {session.user.clientId}
          </p>
          <p>
            <strong>Employee ID:</strong> {session.user.employeeId}
          </p>
        </div>
      </div>
    </div>
  );
}
