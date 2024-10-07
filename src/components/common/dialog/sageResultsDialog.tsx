import { Button } from "../button";
import CustomButton from "../button/commonButton";
import { SqlResult, Query } from "@/app/dashboard/(user-dashboard)/sage/page";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from ".";

type SqlResultProps = {
  query: Query;
};

const SageResultsDialog = ({ query }: SqlResultProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton variant="ghost" className="p-1 m-0 h-full text-primary">
          Results
        </CustomButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Query Results</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="font-bold">Prompt:</h3>
          <p>{query.prompt}</p>
          <h3 className="font-bold mt-4">Status:</h3>
          <p>{query.results.status}</p>
          {query.results.status === "success" ? (
            <>
              <h3 className="font-bold mt-4">SQL:</h3>
              <p>{query.results.sql}</p>
              <h3 className="font-bold mt-4">Results:</h3>
              <pre>{JSON.stringify(query.results.results, null, 2)}</pre>
            </>
          ) : (
            <p className="text-red-500">{query.results.error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SageResultsDialog;
