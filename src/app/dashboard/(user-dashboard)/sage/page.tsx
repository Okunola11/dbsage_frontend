"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { PromptSchema } from "@/schemas";
import DatabaseDialog from "@/components/common/dialog/databaseDialog";
import { useDatabaseContext } from "@/context/databaseContext";
import MatchingTables from "./_components/matchingTables";
import PromptInputForm from "./_components/promptInputForm";
import QueriesList from "./_components/queriesList";

export type SqlResult = {
  prompt: string;
  table_context: string[];
  sql: string;
  csv_data: string;
};

export type Query = {
  prompt: string;
  success: boolean;
  results: SqlResult;
  timestamp: number;
  error?: string;
  isLoading?: boolean;
};

const Sage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [matchingTables, setMatchingTables] = useState<string[]>([]);
  const t = useTranslations("dbSage.dashboard");

  const { tables } = useDatabaseContext();
  const tableNames = tables.map((table) => table.table_name);

  const form = useForm<z.infer<typeof PromptSchema>>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleDownload = (query: Query) => {
    const blob = new Blob([query.results.csv_data], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "query_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prompt = form.watch("prompt");

  useEffect(() => {
    const lowercasePrompt = prompt.toLowerCase();
    const matches = tableNames.filter((tableName) =>
      lowercasePrompt.includes(tableName.toLowerCase())
    );
    setMatchingTables(matches);
  }, [prompt]);

  return (
    <div className="flex flex-col">
      <div className="hidden md:flex justify-end items-center min-h-[50px]">
        <DatabaseDialog />
      </div>

      <div className="flex-1 md:pl-4 flex flex-col items-center justify-center mt-20">
        <div>
          <MatchingTables matchingTables={matchingTables} />

          <PromptInputForm t={t} form={form} setQueries={setQueries} />
        </div>

        <QueriesList queries={queries} handleDownload={handleDownload} />
      </div>
    </div>
  );
};

export default Sage;
