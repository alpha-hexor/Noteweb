import React, { useState } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import ReactMarkdown from "react-markdown";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Live Markdown Editor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Input Section */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Markdown Input</h2>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your markdown here..."
              className="w-full h-64"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Markdown Preview</h2>
            <div className="prose prose-sm md:prose-lg max-w-none">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarkdownEditor;