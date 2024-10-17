"use client";

import React, { useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import * as z from "zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import CustomButton from "@/components/common/button/commonButton";
import { Translator } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { PromptSchema } from "@/schemas";

type Props = {
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
};

const FormIntegratedInput = ({ t, form, onSubmit }: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef<{
    node: Node | null;
    offset: number;
  } | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      cursorPositionRef.current = {
        node: range.startContainer,
        offset: range.startOffset,
      };
    }
  };

  const restoreCursorPosition = () => {
    if (cursorPositionRef.current && inputRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();

      // Check if the saved node still exists in the DOM
      let nodeExists = false;
      let currentNode = inputRef.current.firstChild;
      while (currentNode) {
        if (currentNode === cursorPositionRef.current.node) {
          nodeExists = true;
          break;
        }
        currentNode = currentNode.nextSibling;
      }

      if (nodeExists && cursorPositionRef.current.node) {
        range.setStart(
          cursorPositionRef.current.node,
          cursorPositionRef.current.offset
        );
      } else {
        // If the node doesn't exist or is null, set cursor to the end
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
      }

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  useEffect(() => {
    restoreCursorPosition();
  });

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    saveCursorPosition();
    const newValue = e.currentTarget.textContent || "";
    form.setValue("prompt", newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        const formData = form.getValues();
        onSubmit(formData);
      } else {
        e.preventDefault();
        document.execCommand("insertLineBreak");
        saveCursorPosition();
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="prompt"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative w-full border-b border-primary rounded disabled:cursor-not-allowed disabled:opacity-50">
              <div className="overflow-y-auto max-w-[90%] md:max-w-[93%] min-h-[40px] max-h-[120px]">
                <div
                  ref={inputRef}
                  contentEditable
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  className="min-h-[40px] max-h-[120px] p-2 focus:outline-none text-sm whitespace-pre-wrap word-break-break-word"
                  suppressContentEditableWarning
                >
                  {field.value}
                </div>
              </div>
              <div
                className="absolute top-0 left-0 pointer-events-none p-2 text-muted-foreground text-sm"
                style={{ display: field.value ? "none" : "block" }}
              >
                {t("promptPlaceholder")}
              </div>
              <CustomButton
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 bottom-[5px] rounded-full p-2 min-w-5 min-h-5"
              >
                <FaPaperPlane className="min-w-4 min-h-4" />
              </CustomButton>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormIntegratedInput;
