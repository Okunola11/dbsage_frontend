import Navbar from "@/components/layouts/navbar";
import SettingsSidebar from "./_components/settingsSidebar";

export default async function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="relative mx-auto w-full max-w-[90%] max-lg:overflow-hidden xl:px-4">
        <div className="flex flex-col md:flex-row">
          <div className="shrink-0">
            <SettingsSidebar />
          </div>
          <div className="flex-1 md:w-[calc(100%_-_50px)]">{children}</div>
        </div>
      </div>
    </>
  );
}
