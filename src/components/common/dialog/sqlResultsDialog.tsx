"use client";

import { useCallback } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import CustomButton from "../button/commonButton";
import { useToast } from "@/hooks/use-toast";
import FormattedSql from "@/app/dashboard/(user-dashboard)/sage/_components/formattedSql";

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
          <FormattedSql sql={sql} />
          <CustomButton
            icon={<LuClipboardCopy />}
            isLeftIconVisible={true}
            className="text-xs p-1 mt-2"
            variant="ghost"
            onClick={() => copyToClipboard(sql)}
          >
            Copy SQL
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SqlResultsDialog;
