import { zodResolver } from "@hookform/resolvers/zod";
import { BsDatabaseFillLock } from "react-icons/bs";
import { useForm } from "react-hook-form";
import * as z from "zod";

import CustomButton from "../button/commonButton";
import { Input } from "../input";
import { dbConfigSchema } from "@/schemas";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from ".";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const DatabaseDialog = () => {
  const form = useForm<z.infer<typeof dbConfigSchema>>({
    resolver: zodResolver(dbConfigSchema),
    defaultValues: {
      host: "",
      port: 5432,
      username: "",
      password: "",
      database: "",
    },
  });

  const onSubmit = (values: z.infer<typeof dbConfigSchema>) => {
    const { host, port, username, password, database } = values;

    // Submit the connection request to the backend

    return "connection request accepted.";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton
          icon={<BsDatabaseFillLock />}
          isLeftIconVisible={true}
          variant={"ghost"}
          className="p-2 text-sm md:text-base"
          iconClassName="w-[24px] h-[24px] md:w-[30px] md:h-[30px]"
          //   onClick={() => setIsOpen(true)}
        >
          Connect
        </CustomButton>
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-y-auto max-h-screen md:max-h-[90%]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <BsDatabaseFillLock className="w-7 h-7" /> Connect your database
          </DialogTitle>
          <DialogDescription>
            Connect your SQL database here. A readonly test database has been
            connected for testing, change the details to use your own database.
          </DialogDescription>
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
                      Host/Socket
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="database host"
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
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-dark-2">Port</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="database port"
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
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        className={cn(
                          "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                          form.formState.errors.username && "border-destructive"
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
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                        className={cn(
                          "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                          form.formState.errors.password && "border-destructive"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="database"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-dark-2">
                      Database
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="database"
                        {...field}
                        className={cn(
                          "w-full rounded-md border px-3 py-5 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                          form.formState.errors.database && "border-destructive"
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
                  // isDisabled={isLoading}
                >
                  {/* {isLoading ? (
            <span className="flex items-center gap-x-2">
              <span className="animate-pulse">Logging in...</span>{" "}
              <LoadingSpinner className="size-4 animate-spin sm:size-5" />
            </span>
          ) : (
            <span>{t("loginButton")}</span>
          )} */}
                  Logout
                </CustomButton>

                <CustomButton
                  type="submit"
                  variant="primary"
                  size="default"
                  className="py-3"
                  // isDisabled={isLoading}
                >
                  {/* {isLoading ? (
                  <span className="flex items-center gap-x-2">
                    <span className="animate-pulse">Connecting...</span>{" "}
                    <LoadingSpinner className="size-4 animate-spin sm:size-5" />
                  </span>
                ) : (
                  <span>{t("loginButton")}</span>
                )} */}
                  Connect
                </CustomButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseDialog;
