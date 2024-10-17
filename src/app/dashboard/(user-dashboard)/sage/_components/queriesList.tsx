import { FaCheck } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";

import { type Query } from "../page";
import SageResultsDialog from "@/components/common/dialog/sageResultsDialog";
import SqlResultsDialog from "@/components/common/dialog/sqlResultsDialog";
import CustomButton from "@/components/common/button/commonButton";

interface QueriesListProps {
  queries: Query[];
  handleDownload: (query: Query) => void;
}

const QueriesList = ({ queries, handleDownload }: QueriesListProps) => {
  return (
    <div className="space-y-2 w-full md:max-w-[70%] my-20 text-xs">
      {queries.map((query, index) => (
        <div
          key={index}
          className="border p-2 rounded-md flex justify-between items-center"
        >
          <div className="flex items-center space-x-2">
            {query.isLoading ? (
              <div className="animate-pulse w-2 h-2 bg-primary rounded-full" />
            ) : query.success ? (
              <FaCheck className="text-green-500" />
            ) : (
              <IoAlertCircle className="text-red-500" />
            )}
            <span className="truncate max-w-24 md:max-w-40 lg:max-w-64 xl:max-w-xs">
              {query.prompt}
            </span>
          </div>

          <div className="space-x-1 md:space-x-2">
            <SageResultsDialog query={query} isLoading={query.isLoading} />

            <SqlResultsDialog
              isLoading={query.isLoading}
              success={query.success}
              sql={query.results.sql}
            />

            <CustomButton
              variant="ghost"
              className="p-1 m-0 h-full text-red-500"
              isDisabled={query.isLoading || !query.success}
              onClick={() => handleDownload(query)}
            >
              Download
            </CustomButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueriesList;
