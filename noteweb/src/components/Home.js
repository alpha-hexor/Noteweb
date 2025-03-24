import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";

const LiveMarkdownEditor = () => {
  const [blocks, setBlocks] = useState([{ id: 1, content: "", editing: true }]);
  const editorRef = useRef(null);
  const textareaRefs = useRef({});

  useEffect(() => {
    if (blocks[0].editing && textareaRefs.current[1]) {
      textareaRefs.current[1].focus();
    }
  }, []);

  const handleKeyDown = (e, blockId, index) => {
    const block = blocks.find((b) => b.id === blockId);

    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value;
      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);
      const textAfterCursor = value.substring(cursorPos);

      // Check if the block starts with a numbered list pattern
      const listMatch = textBeforeCursor.match(/^(\d+)\.\s/);
      if (listMatch) {
        const currentNumber = parseInt(listMatch[1], 10);
        const nextNumber = currentNumber + 1;

        // Update the current block and add a new block with the next number
        updateBlock(blockId, textBeforeCursor, false);
        addNewBlock(index + 1, `${nextNumber}. ${textAfterCursor}`, true);
        return;
      }

      updateBlock(blockId, textBeforeCursor, false);
      addNewBlock(index + 1, textAfterCursor, true);
    }

    if (e.key === "Backspace" && e.target.value === "" && blocks.length > 1) {
      e.preventDefault();
      deleteBlock(blockId, index);
    }
  };

  const handleBlur = (blockId, content) => {
    updateBlock(blockId, content, false);
  };

  const handleBlockClick = (blockId) => {
    updateBlock(blockId, blocks.find((b) => b.id === blockId).content, true);
  };

  const updateBlock = (blockId, content, editing) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId ? { ...block, content, editing } : block
      )
    );

    if (editing) {
      setTimeout(() => {
        if (textareaRefs.current[blockId]) {
          textareaRefs.current[blockId].focus();
        }
      }, 0);
    }
  };

  const addNewBlock = (index, content = "", editing = true) => {
    const newBlockId = Math.max(...blocks.map((b) => b.id)) + 1;
    const newBlock = { id: newBlockId, content, editing };

    setBlocks([
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1),
    ]);

    setTimeout(() => {
      if (textareaRefs.current[newBlockId]) {
        textareaRefs.current[newBlockId].focus();

        // Automatically place the cursor after the numbering
        const listMatch = content.match(/^(\d+)\.\s/);
        if (listMatch) {
          textareaRefs.current[newBlockId].setSelectionRange(content.length, content.length);
        }
      }
    }, 0);
  };

  const deleteBlock = (blockId, index) => {
    setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId));

    // Focus on the previous block if it exists
    if (index > 0) {
      const prevBlockId = blocks[index - 1].id;
      setTimeout(() => {
        if (textareaRefs.current[prevBlockId]) {
          textareaRefs.current[prevBlockId].focus();
        }
      }, 0);
    }
  };

  const handleChange = (blockId, content) => {
    updateBlock(blockId, content, true);
  };

  return (
    <div
    ref={editorRef}
    className="flex flex-col w-[60%] min-h-screen mx-10 p-6 bg-white"
  >
    {blocks.map((block, index) => (
      <div
        key={block.id}
        className="my-1 min-h-6"
        onClick={() => !block.editing && handleBlockClick(block.id)}
      >
        {block.editing ? (
          <textarea

            ref={(el) => (textareaRefs.current[block.id] = el)}
            value={block.content}
            onChange={(e) => handleChange(block.id, e.target.value)}
            onBlur={() => handleBlur(block.id, block.content)}
            onKeyDown={(e) => handleKeyDown(e, block.id, index)}
            className="w-[90%] bg-gray-300 p-2 focus:outline-none resize-none text-base leading-relaxed"
            style={{
              border: "none", // Remove border
              backgroundColor: "#252145", // Set background color to grey
              outline: "none", // Remove outline
              width: "90%", // Set width to 90%
              color: "white", // Set text color to white
              borderRadius: "5px", // Add border radius
              marginTop: "10px", // Add padding for spacing
          
            }}
            autoFocus
          />
        ) : (
          <div
          className="markdown-body cursor-text"
          style={{
            textAlign: "left", // Align text to the left
            paddingLeft: "50px", // Add padding for spacing
            paddingTop: "10px", // Add padding for spacing
            backgroundColor: "#18152e", // Set background color to white
       
          }}
        >
          {block.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {block.content}
            </ReactMarkdown>
          ) : (
            <div className="h-6">&nbsp;</div>
          )}
        </div>
        )}
      </div>
    ))}
  </div>
  );
};

export default LiveMarkdownEditor;
