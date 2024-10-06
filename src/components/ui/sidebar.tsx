"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { TbTableShortcut } from "react-icons/tb";
import { useTranslations } from "next-intl";

import CustomButton from "../common/button/commonButton";

interface Tables {
  table_name: string;
  columns: string[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const t = useTranslations("dbSage.dashboard");

  return (
    <>
      <motion.div
        className={cn(
          "h-full p-2 hidden md:flex md:flex-col max-w-[150px] flex-shrink-0 overflow-hidden hide_scrollbar",
          className
        )}
        animate={{
          // width: animate ? (open ? "300px" : "60px") : "300px",
          height: animate ? (open ? "100%" : "50px") : "100%",
        }}
        // onMouseEnter={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
        {...props}
      >
        <>
          <CustomButton
            icon={<TbTableShortcut />}
            isLeftIconVisible={true}
            variant="ghost"
            className="text-xs p-2 shadow-sm mb-2 shadow-primary/90 min-w-[120px] hidden md:flex"
            onClick={() => setOpen(!open)}
          >
            {t("tables")}
          </CustomButton>
          {children}
        </>
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between w-full"
      )}
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <TbTableShortcut
          className="text-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-background p-10 z-40 flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-30 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IoClose />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarTable = ({
  table,
  className,
}: {
  table: Tables;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const [openTables, setOPenTables] = useState(false);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="text-xs "
        onMouseEnter={() => setOPenTables(true)}
        onMouseLeave={() => setOPenTables(false)}
      >
        {table.table_name}
      </div>
      <motion.div
        animate={{
          display: animate
            ? openTables
              ? "inline-block"
              : "none"
            : "inline-block",
          opacity: animate ? (openTables ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
        onMouseEnter={() => setOPenTables(true)}
        onMouseLeave={() => setOPenTables(false)}
      >
        {table.columns.map((column, idx) => (
          <li key={idx} className="list-none pl-4 text-xs">
            {column}
          </li>
        ))}
      </motion.div>
    </div>
  );
};
