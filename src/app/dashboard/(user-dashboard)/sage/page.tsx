"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";

import { PromptSchema } from "@/schemas";
import DatabaseDialog from "@/components/common/dialog/databaseDialog";
import { useDatabaseContext } from "@/context/databaseContext";
import MatchingTables from "./_components/matchingTables";
import PromptInputForm from "./_components/promptInputForm";
import QueriesList from "./_components/queriesList";
import { getSql } from "@/actions/prompt";

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
  const [isPending, startTransition] = useTransition();
  const [queries, setQueries] = useState<Query[]>([]);
  const [matchingTables, setMatchingTables] = useState<string[]>([]);
  const t = useTranslations("dbSage.dashboard");

  const { toast } = useToast();
  const { tables } = useDatabaseContext();
  const tableNames = tables.map((table) => table.table_name);

  const form = useForm<z.infer<typeof PromptSchema>>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PromptSchema>) => {
    const newQuery = {
      prompt: values.prompt,
      success: false,
      results: {} as SqlResult,
      timestamp: Date.now(),
      isLoading: true,
    };

    setQueries((prevQueries) => [newQuery, ...prevQueries]);

    // Submit the prompt to the backend
    startTransition(async () => {
      await getSql(values).then(async (data) => {
        if (data.status_code === 200) {
          const results = data.data as SqlResult;
          setQueries((prevQueries) =>
            prevQueries.map((q, index) =>
              index === 0
                ? {
                    ...q,
                    success: data.success,
                    results: results,
                    isLoading: false,
                  }
                : q
            )
          );

          toast({
            title: "Success",
            description: data.message,
          });
        } else {
          setQueries((prevQueries) =>
            prevQueries.map((q, index) =>
              index === 0
                ? {
                    ...q,
                    error: data.message,
                    isLoading: false,
                  }
                : q
            )
          );
          toast({
            title: "An error occurred",
            description: data.message,
            variant: "destructive",
          });
        }
      });
    });

    form.reset();
  };

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

      <div className="flex-1 pl-4 flex flex-col items-center justify-center mt-20">
        <div>
          <MatchingTables matchingTables={matchingTables} />

          <PromptInputForm t={t} form={form} onSubmit={onSubmit} />
        </div>

        <QueriesList queries={queries} handleDownload={handleDownload} />
      </div>
    </div>
  );
};

export default Sage;
