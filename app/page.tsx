import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const role = session?.user?.role?.toLowerCase() ?? "";

  redirect(
    role.includes("contador")
      ? "/contabilidad"
      : role.includes("chofer")
        ? "/chofer"
        : role.includes("cliente")
          ? "/cliente"
          : "/dashboard",
  );
}
