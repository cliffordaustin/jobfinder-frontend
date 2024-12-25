"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { assignIn } from "lodash";

import ImageThumb from "./ImageThumb";
import { Button } from "@mantine/core";
import nProgress from "nprogress";
import { CompanyProfile, CompanyProfileImages } from "@/types/api.types";
import toast from "react-hot-toast";
import { defaultToastStyle } from "@/utils/theme";
import { revalidatePath } from "next/cache";

export interface ExtendFile extends File {
  id: string;
  preview: string;
  comment: string;
  completedPercent: number;
}

export interface ImageFile {
  id: string;
  preview: string;
  comment: string;
  completedPercent: number;
}

function ImageUpload({
  company,
  setAllImages,
  allImages,
}: {
  company?: CompanyProfile | null;
  setAllImages?: React.Dispatch<
    React.SetStateAction<CompanyProfileImages[] | undefined>
  >;
  allImages?: CompanyProfileImages[] | undefined;
}) {
  const [files, setFiles] = useState<ExtendFile[] | ImageFile[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      files?.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const images: ImageFile[] | undefined = allImages?.map((image) => ({
    id: `${image.id}`,
    preview: image.image,
    comment: image.comment || "",
    completedPercent: 0,
  }));

  useEffect(() => {
    if (images) {
      setFiles(images);
    }
  }, []);

  const router = useRouter();

  const sendCompanyProfileImage = async () => {
    try {
      setLoading(true);
      const companyProfile = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user-company-profile/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      if (await companyProfile.data.slug) {
        if (files.length > 0) {
          files.forEach((file, index) => {
            if ("name" in file) {
              const fd = new FormData();
              fd.append("image", file as ExtendFile, (file as ExtendFile).name);
              fd.append("comment", file.comment);

              try {
                axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/company-profiles/${companyProfile.data.slug}/create-company-profile-image/`,
                  fd,
                  {
                    headers: {
                      Authorization: "Token " + Cookies.get("token"),
                    },
                    onUploadProgress: (progressEvent) => {
                      let percentCompleted = progressEvent.total
                        ? Math.floor(
                            (progressEvent.loaded * 100) / progressEvent.total
                          )
                        : 0;

                      let updatedFiles = files.map((item) => {
                        if (item.id === `${file.name}-${index}`) {
                          return assignIn(item, {
                            completedPercent: percentCompleted,
                          });
                        }
                        return item;
                      });

                      setFiles(updatedFiles);
                    },
                  }
                );
              } catch (error) {
                console.log("error", error);
              }
            }
          });
        }
      }

      setLoading(false);
      if (company) {
        location.reload();
      } else {
        nProgress.start();
        router.push("/company-profile");
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      setFiles(
        files.concat(
          acceptedFiles.map((file, index) =>
            Object.assign(file, {
              id: `${file.name}-${index}`,
              preview: URL.createObjectURL(file),
              comment: "",
              completedPercent: 0,
            })
          )
        )
      );
    },
  });

  const removeImageThumb = async (file: ExtendFile | ImageFile) => {
    let filterFiles: ExtendFile[] | ImageFile[] = [];
    if ("name" in file) {
      filterFiles = (files as ExtendFile[]).filter(
        (filterFile) => filterFile.name !== file?.name
      );

      setFiles(filterFiles);
    } else {
      try {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/company-profile-images/${file.id}/`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        );

        filterFiles = (files as ExtendFile[]).filter(
          (filterFile) => filterFile.id !== file?.id
        );

        if (setAllImages) {
          setAllImages(
            company?.company_images.filter(
              (item) => item.id !== Number(file.id)
            )
          );
        }

        setFiles(filterFiles);

        router.refresh();

        return res;
      } catch (error) {
        console.log("error", error);
        toast.error("Unable to delete image", defaultToastStyle);
      }
    }
  };

  const thumbs = files.map((file) => (
    <ImageThumb
      file={file}
      key={file.id}
      filterFile={removeImageThumb}
      company={company}
    ></ImageThumb>
  ));

  return (
    <div className="py-4 sm:px-6 px-2">
      <div className="mx-auto mt-8 max-w-3xl bg-gray-100 rounded-lg max-h-600 overflow-y-scroll sm:px-12 px-6 py-8">
        <h1 className="font-bold text-center text-2xl text-black">
          Upload your images
        </h1>
        <div
          {...getRootProps({
            className:
              "mt-2 rounded-lg flex flex-col items-center justify-center py-5 box-dashed border-purple-600",
          })}
        >
          <input {...getInputProps()} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            className="h-32 w-32 text-purple-600"
          >
            <path
              d="M20 5h-9.586L8.707 3.293A.997.997 0 0 0 8 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2z"
              fill="currentColor"
            />
          </svg>
          <h3 className="text-gray-600">Drag & Drop your image here</h3>
        </div>
        <div className="flex flex-col gap-4 items-center">{thumbs}</div>
      </div>

      <div
        className={
          "flex items-center justify-between " + (company ? "mt-4" : "mt-12")
        }
      >
        <div></div>

        <div className="flex items-center gap-3">
          {!company && (
            <Button
              onClick={() => router.push("/company-profile")}
              color="dark.8"
              variant="outline"
              opacity={0.5}
            >
              Skip
            </Button>
          )}

          <Button
            onClick={sendCompanyProfileImage}
            loading={loading}
            color="dark"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
