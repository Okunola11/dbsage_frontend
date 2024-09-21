import { Suspense } from "react";

import Providers from "@/components/providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Providers />
      <div>
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
