"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FaCheck } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import * as z from "zod";

import { Input } from "@/components/common/input";
import { PromptSchema } from "@/schemas";
import CustomButton from "@/components/common/button/commonButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import DatabaseDialog from "@/components/common/dialog/databaseDialog";
import { useDatabaseContext } from "@/context/databaseContext";
import SageResultsDialog from "@/components/common/dialog/sageResultsDialog";
import SqlResultsDialog from "@/components/common/dialog/sqlResultsDialog";

export type SqlResult = {
  status: "success" | "error";
  tableContext: string[];
  sql: string;
  results: object[];
  csv_data: string;
  error?: string;
};

export type Query = {
  prompt: string;
  results: SqlResult;
  timestamp: number;
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

  const onSubmit = (values: z.infer<typeof PromptSchema>) => {
    const { prompt } = values;

    // Submit the prompt to the backend

    const data: SqlResult = {
      status: "success",
      tableContext: ["dele", "ali"],
      sql: "SELECT *\n FROM users;",
      results: [
        { name: "john", first_name: "doe" },
        { name: "isaac", first_name: "newton" },
      ],
      csv_data:
        "email,password,first_name,last_name,is_active,is_deleted,id,created_at,updated_at,is_verified,is_superadmin,verified_at,deleted_at\r\nabdwasiuayoadeokunola@gmail.com,,Okunola,Abdulwasiu,False,False,066b7d3c-a0d2-7c4f-8000-6e1d288fc0b8,2024-08-10T20:55:38.036834+00:00,2024-08-10T20:55:38.036834+00:00,False,False,,\r\nwale@example.com,$2b$12$h1kaymJjKGxEltiNWtVqa.09EbUwuDRj8AKk/6t3PSgj81QcmodgC,Wale,Dele,False,False,066be800-2329-74e4-8000-2fdafe43d53b,2024-08-15T22:24:01.869786+00:00,2024-08-15T22:24:01.869786+00:00,False,False,,\r\ntest@gmail.com,$2b$12$A5T/WLEiErLWnbsBCC8JX.KfLzWeNbiFX4rSqTJSaxnvVw9zJe6Wy,Wale,Walex,False,False,066c1060-3ce6-7917-8000-823e5cf6512b,2024-08-17T20:20:19.466868+00:00,2024-08-17T20:20:19.466868+00:00,False,False,,\r\ntestmail2@gmail.com,$2b$12$axT1s7gKB2qR8kaLt8jx6eNV7IjRocouqf4lQ5WhTR6YZG.q7/h0u,Wale,Walex,False,False,066c2406-9536-7435-8000-d4abd1c223fc,2024-08-18T18:41:44.913874+00:00,2024-08-18T18:41:44.913874+00:00,False,False,,\r\n",
    };

    setQueries((prevQueries) => [
      {
        prompt,
        results: data,
        timestamp: Date.now(),
      },
      ...prevQueries,
    ]);
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
          <div className="min-h-[50px]">
            <AnimatePresence>
              {matchingTables.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-2"
                >
                  <AnimatePresence>
                    {matchingTables.map((table) => (
                      <motion.li
                        key={table}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="p-[6px] border rounded-xl text-xs shadow-sm shadow-primary/80"
                      >
                        {table}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 min-w-[280px] md:min-w-[500px]"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel className="text-neutral-dark-2">Prompt</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder={t("promptPlaceholder")}
                        {...field}
                        className="focus:outline-none border-primary border-t-0 border-x-0 transition duration-150 ease-in-out text-foreground focus-visible:ring-transparent focus-visible:border-b-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="space-y-2 w-full md:max-w-[70%] mt-20 text-xs">
          {queries.map((query, index) => (
            <div
              key={index}
              className="border p-2 rounded-md flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                {query.results.status === "success" ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <IoAlertCircle className="text-red-500" />
                )}
                <span className="truncate max-w-24 md:max-w-40 lg:max-w-64 xl:max-w-xs">
                  {query.prompt}
                </span>
              </div>

              <div className="space-x-1 md:space-x-2">
                <SageResultsDialog query={query} />

                <SqlResultsDialog sql={query.results.sql} />

                <CustomButton
                  variant="ghost"
                  className="p-1 m-0 h-full text-red-500"
                  onClick={() => handleDownload(query)}
                >
                  Download
                </CustomButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sage;
