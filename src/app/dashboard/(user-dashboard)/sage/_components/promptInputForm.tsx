"use client";

import React, { useTransition, Dispatch, SetStateAction } from "react";

import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Translator } from "@/types";
import { PromptSchema } from "@/schemas";
import FormIntegratedInput from "./formWithInput";
import { getSql } from "@/actions/prompt";
import { SqlResult, Query } from "../page";
import { useToast } from "@/hooks/use-toast";

interface InputProps {
  t: Translator;

  form: UseFormReturn<
    {
      prompt: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  setQueries: Dispatch<SetStateAction<Query[]>>;
}

const PromptInputForm = ({ t, form, setQueries }: InputProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const onSubmit = (values: z.infer<typeof PromptSchema>) => {
    const newQuery = {
      prompt: values.prompt,
      success: false,
      results: {} as SqlResult,
      timestamp: Date.now(),
      isLoading: true,
    };

    setQueries((prevQueries) => [newQuery, ...prevQueries]);

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-[340px] md:w-[500px] xl:w-[650px]"
      >
        <FormIntegratedInput t={t} form={form} onSubmit={onSubmit} />
      </form>
    </Form>
  );
};

export default PromptInputForm;
