import { motion, AnimatePresence } from "framer-motion";

type matchingTablesProps = {
  matchingTables: string[];
};

const MatchingTables = ({ matchingTables }: matchingTablesProps) => {
  return (
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
              {matchingTables.map((table, index) => (
                <motion.li
                  key={table}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
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
  );
};

export default MatchingTables;
