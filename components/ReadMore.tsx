import { Button } from "@mantine/core";
import React from "react";
import Parser from "html-react-parser";

function ReadMore({ text, length }: { text: string; length: number }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const fText =
    text.length > length && !isOpen ? text.slice(0, length) + "..." : text;
  return (
    <div className="flex flex-col">
      <div className="text-base prose max-w-none prose-violet">
        {Parser(fText)}
      </div>

      {text.length > length && (
        <div className="relative h-[80px] w-full">
          <div
            className={
              "blur-2xl -mt-8 z-20 h-full w-full " +
              (isOpen ? "bg-black/0" : "bg-white")
            }
          ></div>

          <Button
            size="md"
            className="absolute -top-8"
            classNames={{
              root: "!w-full",
            }}
            onClick={() => setIsOpen(!isOpen)}
            color="gray.8"
            variant="outline"
          >
            {isOpen ? "Read less" : "Read more"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReadMore;
