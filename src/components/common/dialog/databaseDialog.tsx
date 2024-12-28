"use client";

import { useTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsDatabaseFillLock } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";

import CustomButton from "../button/commonButton";
import { Input } from "../input";
import { dbConfigSchema } from "@/schemas";
import { connectDatabase, closeDatabaseConnection } from "@/actions/database";
import LoadingSpinner from "@/components/miscellaneous/loadingSpinner";
import { useDatabaseContext } from "@/context/databaseContext";
import { DatabaseTable } from "@/context/databaseContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from ".";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const DatabaseDialog = ({
  handleStatusDialogClose,
}: {
  handleStatusDialogClose: () => void;
}) => {
  const t = useTranslations("dbSage.database");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState("");
  const { updateTables, clearTables } = useDatabaseContext();
  const { toast } = useToast();

  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  const form = useForm<z.infer<typeof dbConfigSchema>>({
    resolver: zodResolver(dbConfigSchema),
    defaultValues: {
      host: "",
      database_type: "postgresql",
      port: 5432,
      username: "",
      password: "",
      database_name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof dbConfigSchema>) => {
    setActiveAction("submit");
    startTransition(async () => {
      await connectDatabase(values).then(async (data) => {
        if (data.status_code === 200) {
          updateTables(data.data as DatabaseTable[]);

          toast({
            title: "Success",
            description: data.message,
          });
        } else {
          toast({
            title: "An error occurred",
            description: data.message,
          });
        }
      });
      setActiveAction("");
      handleDialogClose();
      handleStatusDialogClose();
    });
  };

  const onLogout = () => {
    setActiveAction("logout");
    startTransition(async () => {
      await closeDatabaseConnection().then(async (data) => {
        if (data.status_code === 200) {
          clearTables();

          toast({
            title: "Success",
            description: data.message,
          });
        } else {
          toast({
            title: "An error occurred",
            description: data.message,
          });
        }
      });
      setActiveAction("");
      handleDialogClose();
      handleStatusDialogClose();
    });
  };

  const isSubmitting = isLoading && activeAction === "submit";
  const isLoggingOut = isLoading && activeAction === "logout";

  return (
    <>
      <CustomButton
        icon={<BsDatabaseFillLock />}
        isLeftIconVisible={true}
        variant={"ghost"}
        className="p-2 text-sm md:text-base"
        iconClassName="w-[24px] h-[24px] md:w-[30px] md:h-[30px] text-primary"
        onClick={handleDialogOpen}
      >
        {t("connect")}
      </CustomButton>

      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-screen md:max-h-[90%]">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <BsDatabaseFillLock className="w-7 h-7" /> {t("title")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="grid">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 min-w-[280px] md:min-w-[500px]"
              >
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark-2">
                        {t("host.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("host.placeholder")}
                          {...field}
                          className={cn(
                            "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                            form.formState.errors.host && "border-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="database_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark-2">
                        {t("type.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("type.placeholder")}
                          {...field}
                          className={cn(
                            "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                            form.formState.errors.database_type &&
                              "border-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark-2">
                        {t("port.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("port.placeholder")}
                          {...field}
                          className={cn(
                            "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                            form.formState.errors.port && "border-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark-2">
                        {t("username.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("username.placeholder")}
                          {...field}
                          className={cn(
                            "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                            form.formState.errors.username &&
                              "border-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark-2">
                        {t("password.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("password.placeholder")}
                          {...field}
                          className={cn(
                            "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                            form.formState.errors.password &&
                              "border-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="database_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark-2">
                        {t("database.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("database.placeholder")}
                          {...field}
                          className={cn(
                            "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                            form.formState.errors.database_name &&
                              "border-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <CustomButton
                    type="button"
                    variant="primary"
                    size="default"
                    className="py-3"
                    isDisabled={isLoading}
                    onClick={onLogout}
                  >
                    {isLoggingOut ? (
                      <span className="flex items-center gap-x-2">
                        <span className="animate-pulse">Logging out...</span>{" "}
                        <LoadingSpinner className="size-4 animate-spin sm:size-5" />
                      </span>
                    ) : (
                      <span>{t("logout")}</span>
                    )}
                  </CustomButton>

                  <CustomButton
                    type="submit"
                    variant="primary"
                    size="default"
                    className="py-3"
                    isDisabled={isLoading}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-x-2">
                        <span className="animate-pulse">Connecting...</span>{" "}
                        <LoadingSpinner className="size-4 animate-spin sm:size-5" />
                      </span>
                    ) : (
                      <span>{t("connect")}</span>
                    )}
                  </CustomButton>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DatabaseDialog;
