"use client";

import { useState } from "react";

import { Sidebar, SidebarBody, SidebarTable } from "@/components/ui/sidebar";
import { lora } from "@/app/fonts/fonts";
import { cn } from "@/lib/utils";
import DatabaseConnectionDialog from "@/components/common/dialog/databaseStatusDialog";
import { useDatabaseContext } from "@/context/databaseContext";
import { SwitchTables } from "@/components/ui/switch";

const SettingsSidebar = () => {
  const [open, setOpen] = useState(false);
  const [openColumns, setOPenColumns] = useState(false);
  const { tables } = useDatabaseContext();

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-full">
          <div className="flex flex-col justify-between md:border rounded-md p-4 h-[calc(100vh-170px)] space-y-3">
            <div className="w-full">
              <SwitchTables
                openColumns={openColumns}
                setOPenColumns={setOPenColumns}
              />
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className={cn("flex flex-col gap-3", lora.className)}>
                {tables.map((table, idx) => (
                  <SidebarTable
                    key={idx}
                    table={table}
                    openColumns={openColumns}
                  />
                ))}
              </div>
            </div>

            <div className="flex w-full justify-center md:hidden">
              <DatabaseConnectionDialog />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
};

export default SettingsSidebar;
