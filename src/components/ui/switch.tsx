"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Label } from "./label";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

type TablesColumnsPrompt = {
  openColumns: boolean;
  setOPenColumns: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SwitchTables({
  openColumns,
  setOPenColumns,
}: TablesColumnsPrompt) {
  const handleToggle = () => {
    setOPenColumns(!openColumns);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="tables"
        checked={openColumns}
        onCheckedChange={handleToggle}
        className="h-5 w-9"
      />
      <Label htmlFor="tables" className="text-sm">
        Tables Only
      </Label>
    </div>
  );
}
