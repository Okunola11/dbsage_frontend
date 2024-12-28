import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from ".";
import { Loader } from "lucide-react";

import {
  getDatabaseConnection,
  closeDatabaseConnection,
} from "@/actions/database";
import { useToast } from "@/hooks/use-toast";
import DatabaseDialog from "./databaseDialog";
import CustomButton from "../button/commonButton";
import { useDatabaseContext } from "@/context/databaseContext";
import LoadingSpinner from "@/components/miscellaneous/loadingSpinner";

type DatabaseData = {
  host: string;
  database_type: string;
  username: string;
  database_name: string;
  port: number;
};

type ConnectionData = {
  has_connection?: boolean;
  data?: DatabaseData;
  last_used?: Date | null;
  connection_age?: string | null;
};

const DatabaseConnectionDialog = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { clearTables } = useDatabaseContext();
  const { toast } = useToast();

  const fetchConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getDatabaseConnection();
      if (response.status_code === 200) {
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "An error occurred",
          description: response.message,
          variant: "destructive",
        });
      }
      setConnectionStatus(response.data as ConnectionData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching database connection status:", error);
      setConnectionStatus({});
      setIsLoading(false);
    }
  };

  const onLogout = () => {
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
      handleStatusDialogClose();
    });
  };

  const handleDialogOpen = async () => {
    setIsOpen(true);

    await fetchConnectionStatus();
  };

  const handleStatusDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <CustomButton
        variant="ghost"
        onClick={handleDialogOpen}
        className="text-sm p-2 shadow-sm mb-2 shadow-primary/90 min-w-28"
      >
        Database
      </CustomButton>

      <Dialog open={isOpen} onOpenChange={handleStatusDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Database Connection Status</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin" />
              </div>
            ) : connectionStatus ? (
              <div className="space-y-3">
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                      connectionStatus.has_connection
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {connectionStatus.has_connection
                      ? "Connected"
                      : "Disconnected"}
                  </span>
                </div>

                {(() => {
                  const dbDetails = connectionStatus.data;
                  return (
                    <>
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>{" "}
                        <span className="capitalize">
                          {dbDetails?.database_type ?? "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Host:</span>{" "}
                        {dbDetails?.host ?? "N/A"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Port:</span>{" "}
                        {dbDetails?.port ?? "N/A"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Database:
                        </span>{" "}
                        {dbDetails?.database_name ?? "N/A"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Username:
                        </span>{" "}
                        {dbDetails?.username ?? "N/A"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Last Used:
                        </span>{" "}
                        {connectionStatus.last_used
                          ? new Date(
                              connectionStatus.last_used
                            ).toLocaleString()
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Connection Age:
                        </span>{" "}
                        {connectionStatus.connection_age || "N/A"}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center text-red-500 font-medium">
                Failed to fetch database connection status
              </div>
            )}
          </DialogDescription>

          <DialogFooter>
            {connectionStatus ? (
              connectionStatus.has_connection ? (
                <div className="flex items-center justify-center">
                  <CustomButton
                    variant="ghost"
                    className="bg-red-500 text-white"
                    onClick={onLogout}
                    isDisabled={isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-x-2">
                        <span className="animate-pulse">Closing...</span>{" "}
                        <LoadingSpinner className="size-4 animate-spin sm:size-5" />
                      </span>
                    ) : (
                      <span>Close Connection</span>
                    )}
                  </CustomButton>
                </div>
              ) : (
                <DatabaseDialog
                  handleStatusDialogClose={handleStatusDialogClose}
                />
              )
            ) : (
              <DatabaseDialog
                handleStatusDialogClose={handleStatusDialogClose}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DatabaseConnectionDialog;
