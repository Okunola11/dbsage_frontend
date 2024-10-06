"use client";

import { useState } from "react";

import { Sidebar, SidebarBody, SidebarTable } from "@/components/ui/sidebar";
import { lora } from "@/app/fonts/fonts";
import { cn } from "@/lib/utils";
import DatabaseDialog from "@/components/common/dialog/databaseDialog";
import { useDatabaseContext } from "@/context/databaseContext";

const SettingsSidebar = () => {
  const [open, setOpen] = useState(false);
  const { tables } = useDatabaseContext();

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-full">
          <div className="flex flex-col justify-between md:border rounded-md p-4 h-[calc(100vh-170px)]">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className={cn("flex flex-col gap-3", lora.className)}>
                {tables.map((table, idx) => (
                  <SidebarTable key={idx} table={table} />
                ))}
              </div>
            </div>

            <DatabaseDialog />
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
};

export default SettingsSidebar;
