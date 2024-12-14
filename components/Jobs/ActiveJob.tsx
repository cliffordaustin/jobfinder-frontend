"use client";
import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import { CompanyProfile, Job, JobsData, UserProfile } from "@/types/api.types";
import moment from "moment";
import { Button, Modal, TextInput } from "@mantine/core";
import Parser from "html-react-parser";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import TextEditor from "../TextEditor";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import JobComponent from "../CompanyProfile/Job";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FaUser } from "react-icons/fa6";

function ActiveJob({ user }: { user?: UserProfile | null }) {
  const [cv, setCv] = useState({
    file: null,
  });

  const [transcript, setTranscript] = useState({
    file: null,
  });

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setCv({
    //     ...cv,
    //     file: event.target.files?[0]
    //  });
  };

  const handleTranscriptChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // setTranscript({ ...transcript, file: event.target.files?[0] });
  };

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      phone: "",
      comment: "",
    },
    validate: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    ),
  });

  const handleSubmit = async () => {};

  const [openedJobModal, { open: openJobModal, close: closeJobModal }] =
    useDisclosure(false);

  const params = useSearchParams();

  const {
    isLoading,
    error,
    data: job,
  } = useQuery({
    queryFn: async () => {
      if (!params.get("v")) return null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.get("v")}/`
      );

      return res.json() as Promise<Job>;
    },
    queryKey: ["job"],
  });
  return params.get("v") ? (
    <>
      <div className="h-[600px] bg-zinc-800 w-2/4 lg:min-h-full overflow-scroll hidden lg:block lg:mb-6">
        <Swiper
          preventInteractionOnTransition={true}
          allowTouchMove={false}
          autoHeight={true}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
        >
          <SwiperSlide>
            <div
              className={
                "md:px-6 py-4 lg:shadow-lg rounded-lg flex flex-col items-center"
              }
            >
              {job?.company_profile_image ? (
                <div className="w-32 relative h-32 rounded-full">
                  <Image
                    src={job.company_profile_image}
                    alt="Image"
                    className="h-full w-full object-cover rounded-full"
                    fill
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex bg-gray-300 items-center justify-center relative rounded-full">
                  <FaUser size={100} />
                </div>
              )}
              <div className="mt-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold">{job?.company_name}</h1>
                <p className="text-base">{job?.job_title}</p>
                <p className="text-base truncate">
                  {job?.remote && job.address
                    ? job.address + "(Remote)"
                    : job?.remote && !job.address
                    ? "Remote"
                    : !job?.remote && job?.address
                    ? job.address
                    : "No address data"}
                </p>
                {job && job.num_applicants > 0 ? (
                  <p className="text-base text-green-600 font-bold">
                    {job.num_applicants} Applicants
                  </p>
                ) : (
                  <p className="text-base text-green-600 font-bold">
                    No applicants
                  </p>
                )}
                <p className="text-base text-center">
                  <span>Job posted by, </span>{" "}
                  <span className="font-bold">
                    {job?.first_name} {""} {job?.last_name}({job?.current_role})
                  </span>
                </p>
                <p className="text-base mt-1 font-medium mb-2">
                  Posted {moment(job?.date_posted).startOf("hour").fromNow()}
                </p>
              </div>
              <div className="flex gap-5 items-center w-full mt-6">
                <div className="w-3/4">
                  <Button
                    color="dark"
                    className="swiper-pagination swiper-button-next px-6 py-2 !w-full !rounded-md"
                  >
                    Apply for this job
                  </Button>
                </div>
                <div className="w-1/5">
                  <Button
                    color="dark"
                    className="!bg-gray-200 !border-gray-200 !w-full py-2 px-2 !rounded-md !text-black font-bold"
                  >
                    Save
                  </Button>
                </div>
              </div>
              {job?.description && (
                <div className="mt-6 prose prose-invert">
                  {Parser(job.description)}
                </div>
              )}
              <div className="w-full mt-6">
                <Button
                  onClick={() => {}}
                  color="dark"
                  className="!rounded-md w-full py-2"
                >
                  View Company Profile
                </Button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={"md:px-6 py-4 bg-white lg:shadow-lg rounded-lg"}>
              <div className="swiper-pagination swiper-button-prev cursor-pointer flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="font-bold text-purple-600">Job Info</h3>
              </div>
              <div className="md:px-6 px-0">
                <div className="mt-5">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-bold">Your CV&nbsp;</h3>
                      <span className="text-red-500 font-bold mt-2">*</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <label
                        htmlFor="cv"
                        className="cursor-pointer z-50 py-2 ml-2 px-6 !rounded-md font-bold bg-purple-600 text-white"
                      >
                        Upload
                      </label>
                      <input
                        className="hidden"
                        type="file"
                        onChange={handleCvChange}
                        id="cv"
                      />
                      {cv.file && (
                        <div className="truncate w-40">
                          {/* {cv.file.name} */}
                        </div>
                      )}
                      {cv.file && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          onClick={() => setCv({ ...cv, file: null })}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-bold">Transcript</h3>
                    </div>
                    <div className="flex gap-4 items-center">
                      <label
                        htmlFor="transcript"
                        className="cursor-pointer z-50 py-2 ml-2 px-6 !rounded-md font-bold bg-purple-600 text-white"
                      >
                        Upload
                      </label>
                      <input
                        className="hidden"
                        type="file"
                        onChange={handleTranscriptChange}
                        id="transcript"
                      />
                      {transcript.file && (
                        <div className="truncate w-40">
                          {/* {transcript.file.name} */}
                        </div>
                      )}
                      {transcript.file && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          onClick={() =>
                            setTranscript({ ...transcript, file: null })
                          }
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-bold">Email&nbsp;</h3>
                      <span className="text-red-500 font-bold mt-2">*</span>
                    </div>
                    <TextInput
                      withAsterisk
                      label="Email"
                      variant="unstyled"
                      size="lg"
                      className="text-white"
                      placeholder="your@email.com"
                      key={form.key("email")}
                      classNames={{
                        input: "!text-white",
                        wrapper: "border border-gray-300 mt-1 rounded-md px-2",
                        label: "mb-1",
                      }}
                      {...form.getInputProps("email")}
                    ></TextInput>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-bold">Phone number&nbsp;</h3>
                      <span className="text-red-500 font-bold mt-2">*</span>
                    </div>
                    <TextInput
                      name="phone"
                      placeholder="Phone Number"
                      type="text"
                      variant="unstyled"
                      size="lg"
                      className="text-white"
                      key={form.key("phone")}
                      classNames={{
                        input: "!text-white",
                        wrapper: "border border-gray-300 mt-1 rounded-md px-2",
                        label: "mb-1",
                      }}
                      {...form.getInputProps("phone")}
                    ></TextInput>
                  </div>
                  <div className="mt-6 comment">
                    <div className="flex items-center mb-2">
                      <h3 className="font-bold">Other comment</h3>
                    </div>
                    <TextEditor
                      content={form.values.comment}
                      onChange={(value) => form.setFieldValue("comment", value)}
                    ></TextEditor>
                  </div>
                  <Button
                    type="submit"
                    className={"py-1 mt-6 w-full px-6 !rounded-md font-bold "}
                  >
                    <span>Apply</span>
                  </Button>
                </form>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <Modal
        radius="lg"
        opened={openedJobModal}
        onClose={closeJobModal}
        // title="Seekers"
        classNames={{
          root: "!bg-zinc-800",
          content: "!bg-zinc-800",
          header: "!bg-zinc-800 !border-b !border-zinc-600",
        }}
        size={1100}
        centered
      >
        <JobComponent user={user} job={job}></JobComponent>
      </Modal>
    </>
  ) : (
    <div></div>
  );
}

export default ActiveJob;
