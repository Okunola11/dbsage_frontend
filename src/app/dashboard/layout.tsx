import { auth } from "@/lib/auth";

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return;
  }

  return children;
}
