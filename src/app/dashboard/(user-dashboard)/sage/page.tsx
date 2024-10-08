"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { Input } from "@/components/common/input";
import { PromptSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import DatabaseDialog from "@/components/common/dialog/databaseDialog";

type Query = {
  prompt: string;
  results: string;
  sql: string;
};

const Sage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [matchingTables, setMatchingTables] = useState<string[]>([]);
  const t = useTranslations("dbSage.dashboard");

  const tableNames = ["users", "products", "orders", "customers", "inventory"];

  const form = useForm<z.infer<typeof PromptSchema>>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PromptSchema>) => {
    const { prompt } = values;

    // Submit the prompt to the backend

    setQueries((prevQueries) => [
      ...prevQueries,
      { prompt, results: "Sample Results", sql: "SELECT * FROM example" },
    ]);
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
              <p>{query.prompt}</p>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    /* Show results */
                  }}
                  className="text-primary"
                >
                  Results
                </button>
                <button
                  onClick={() => {
                    /* Show SQL */
                  }}
                  className="text-green-500"
                >
                  SQL
                </button>
                <button
                  onClick={() => {
                    /* Download results */
                  }}
                  className="text-red-500"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sage;
