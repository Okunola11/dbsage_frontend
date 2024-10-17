"use client";

import { useCallback } from "react";
import CustomButton from "../button/commonButton";
import { Query } from "@/app/dashboard/(user-dashboard)/sage/page";
import FormattedSql from "@/app/dashboard/(user-dashboard)/sage/_components/formattedSql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from ".";
import { FaCheck } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

type SqlResultProps = {
  isLoading?: boolean;
  query: Query;
};

const SageResultsDialog = ({ query, isLoading }: SqlResultProps) => {
  const parseCsvData = useCallback((csvData: string) => {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim() || "";
        return obj;
      }, {} as Record<string, string>);
    });
    return { headers, rows };
  }, []);

  const renderTable = useCallback(
    (csvData: string) => {
      const { headers, rows } = parseCsvData(csvData);
      return (
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="px-4 py-2 font-bold text-left whitespace-nowrap"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="border-b break-words"
                    style={{ maxWidth: "200px", minWidth: "100px" }}
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    },
    [parseCsvData]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton
          variant="ghost"
          className="p-1 m-0 h-full text-primary"
          isDisabled={isLoading}
        >
          Results
        </CustomButton>
      </DialogTrigger>

      <DialogContent className="max-w-[450px] md:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-screen md:max-h-[90%]">
        <div className="max-w-[350px] md:max-w-[620px] lg:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Query Results</DialogTitle>
            <DialogDescription>
              {query.success ? (
                <div className="flex gap-2 items-center">
                  <FaCheck className="text-green-500 w-4 h-4" />{" "}
                  <p>Query successfully completed.</p>
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <IoMdCloseCircle className="text-red-500 w-5 h-5" />{" "}
                  <p>Query failed.</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-bold">Prompt:</h3>
            <p className="text-sm whitespace-pre-wrap overflow-wrap-break-word break-words">
              {query.prompt}
            </p>

            {query.success ? (
              <div className="w-full">
                <h3 className="font-bold mt-6 mb-1">SQL:</h3>
                <FormattedSql sql={query.results.sql} />
                <h3 className="font-bold mt-6">Results:</h3>
                <div className="overflow-x-auto">
                  {renderTable(query.results.csv_data)}
                </div>
              </div>
            ) : (
              <div className="w-full mt-4">
                <h3 className="font-bold">Error:</h3>
                <p className="text-red-500 text-sm">{query.error}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SageResultsDialog;
