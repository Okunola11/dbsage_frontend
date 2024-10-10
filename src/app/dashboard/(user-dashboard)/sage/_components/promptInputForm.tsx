import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/common/input";
import { Translator } from "@/types";
import { PromptSchema } from "@/schemas";

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
  onSubmit: (values: z.infer<typeof PromptSchema>) => void;
}

const PromptInputForm = ({ t, form, onSubmit }: InputProps) => {
  return (
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
                  // type="search"
                  placeholder={t("promptPlaceholder")}
                  {...field}
                  className="focus:outline-none rounded border-primary border-t-0 border-x-0 transition duration-150 ease-in-out text-foreground focus-visible:ring-transparent focus-visible:border-b-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default PromptInputForm;
