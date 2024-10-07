import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FormattedSqlProps {
  sql: string;
}

const FormattedSql: React.FC<FormattedSqlProps> = ({ sql }) => {
  const extractSqlStatement = (fullSql: string) => {
    const match = fullSql.match(
      /(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)[\s\S]+/i
    );
    return match ? match[0].trim() : fullSql.trim();
  };

  const sqlStatement = extractSqlStatement(sql);

  return (
    <div className="rounded overflow-hidden">
      <SyntaxHighlighter
        language="sql"
        style={tomorrow}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {sqlStatement}
      </SyntaxHighlighter>
    </div>
  );
};

export default FormattedSql;
