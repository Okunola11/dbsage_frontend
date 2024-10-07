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

type SqlResultProps = {
  query: Query;
};

const SageResultsDialog = ({ query }: SqlResultProps) => {
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
        <CustomButton variant="ghost" className="p-1 m-0 h-full text-primary">
          Results
        </CustomButton>
      </DialogTrigger>

      <DialogContent className="max-w-[450px] md:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-screen md:max-h-[90%]">
        <div className="max-w-[350px] md:max-w-[620px] lg:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Query Results</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-bold">Prompt:</h3>
            <p className="text-sm">{query.prompt}</p>
            <h3 className="font-bold mt-6">Status:</h3>
            <p>{query.results.status}</p>

            {query.results.status === "success" ? (
              <div className="w-full">
                <h3 className="font-bold mt-6 mb-1">SQL:</h3>
                <FormattedSql sql={query.results.sql} />
                <h3 className="font-bold mt-6">Results:</h3>
                <div className="overflow-x-auto">
                  {renderTable(query.results.csv_data)}
                </div>
              </div>
            ) : (
              <p className="text-red-500">{query.results.error}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SageResultsDialog;
