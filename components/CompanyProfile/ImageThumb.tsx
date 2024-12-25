"use client";

import { ActionIcon, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";
import { ExtendFile, ImageFile } from "./ImageUpload";
import Image from "next/image";
import { CompanyProfile, CompanyProfileImages } from "@/types/api.types";
import { MdDelete } from "react-icons/md";
import { AxiosResponse } from "axios";

function ImageThumb({
  file,
  filterFile,
  company,
}: {
  file: ExtendFile | ImageFile;
  filterFile: (
    file: ExtendFile | ImageFile
  ) => Promise<AxiosResponse<any, any> | undefined>;
  company?: CompanyProfile | null;
}) {
  const [state, setState] = useState({
    comment: file.comment || "",
    counter: 0,
  });

  // useEffect(() => {
  //   if (file) file.comment = state.comment;
  // }, [state.comment]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value.slice(0, 100),
      counter: event.target.value.slice(0, 100).length,
    });
  };

  const [opened, { open, close }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full">
      <div
        className={
          "w-full bg-gray-200 py-2 rounded-md " +
          (file?.completedPercent === 100 ? "opacity-50" : "")
        }
      >
        <div className="rounded-lg flex items-center gap-4 justify-between px-6 py-1">
          <Image
            src={file.preview}
            alt="Company Image"
            width={80}
            height={56}
            className="object-cover rounded-lg"
          />

          <p className="text-black block w-2/4 truncate">
            {"name" in file ? file.name : file.preview}
          </p>
          <div className="flex justify-end gap-8 flex-grow items-center">
            {"size" in file && (
              <p className="text-gray-600">
                {(file.size / 1_048_576).toFixed(2)}MB
              </p>
            )}

            <ActionIcon
              onClick={async () => {
                setLoading(true);
                await filterFile(file);
                setLoading(false);
              }}
              loading={loading}
              color="red"
              variant="filled"
              aria-label="Delete"
            >
              {"name" in file ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <MdDelete></MdDelete>
              )}
            </ActionIcon>
          </div>
        </div>
        <div className="flex items-center px-4 justify-between">
          <div></div>
          <Button onClick={open} color="dark" size="xs">
            Add a comment
          </Button>
        </div>
        {file && file.completedPercent > 0 ? (
          <div className="border relative border-gray-200 rounded-full w-11/12 mx-auto mt-2 h-6 overflow-hidden">
            <div
              className={"bg-purple-500 h-full"}
              style={{ width: file.completedPercent + "%" }}
            ></div>
            <div className="absolute right-5 top-2/4 font-bold z-20 -translate-y-2/4">
              {file.completedPercent}%
            </div>
          </div>
        ) : null}
      </div>
      <div className="px-6">
        <Modal
          classNames={{
            root: "!bg-white",
            content: "!bg-white",
            header: "!bg-gray-100 !border-b border-zinc-200",
            title: "!text-black !font-bold",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          onClose={close}
          opened={opened}
          title="Add comment"
          radius="md"
          size="lg"
          centered
        >
          <TextInput
            name="comment"
            placeholder="Comment"
            label="Comment"
            value={state.comment}
            onChange={onChange}
            className="mt-10"
            variant="unstyled"
            size="md"
            classNames={{
              input: "!text-black",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1 text-black",
            }}
          ></TextInput>

          <div className="flex items-center justify-between">
            <div></div>
            <p
              className={
                "text-white mt-2 text-sm " +
                (state.counter === 100 ? "text-red-500" : "")
              }
            >
              {state.counter}/100
            </p>
          </div>

          <Button color="dark" onClick={close} className="mt-2">
            Add image comment
          </Button>
        </Modal>
      </div>
    </div>
  );
}

export default ImageThumb;
