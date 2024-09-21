import { getSession } from "next-auth/react";

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return;
  }

  return children;
}
