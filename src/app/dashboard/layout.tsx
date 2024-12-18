import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions/userSession";

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return children;
}
