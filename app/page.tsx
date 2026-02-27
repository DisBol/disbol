import { redirect } from "next/navigation";

export default function Home() {
  // Redirección automática al dashboard
  redirect("/dashboard");
}
