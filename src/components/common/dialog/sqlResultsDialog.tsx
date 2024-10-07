"use client";

import { useCallback } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import CustomButton from "../button/commonButton";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from ".";

type SqlProps = {
  sql: string;
};

const SqlResultsDialog = ({ sql }: SqlProps) => {
  const { toast } = useToast();

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          toast({
            title: "Copied to clipboard",
            description: "The SQL query has been copied to your clipboard.",
          });
        } catch (err) {
          console.error("Failed to copy: ", err);
          toast({
            title: "Copy failed",
            description:
              "Unable to copy to clipboard. Please try selecting and copying the text manually.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Copy failed",
          description:
            "Unable to copy to clipboard. Please try selecting and copying the text manually.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton variant="ghost" className="p-1 m-0 h-full text-green-500">
          SQL
        </CustomButton>
        {/* <button className="text-green-500">SQL</button> */}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generated SQL</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <pre className="p-4 rounded">{sql}</pre>
          <CustomButton onClick={() => copyToClipboard(sql)}>
            <LuClipboardCopy className="w-4 h-4 mr-2" />
            Copy SQL
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SqlResultsDialog;
