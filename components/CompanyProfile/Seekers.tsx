import {
  CompanyProfile,
  Job,
  SeekerData,
  UserProfile,
} from "@/types/api.types";
import { Button, Loader, NumberInput, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import { z } from "zod";
import TextEditor from "../TextEditor";
import Image from "next/image";
import SeekerDetail from "./SeekerDetail";
import SwiperCore from "swiper";
import toast from "react-hot-toast";
import { defaultToastStyle } from "@/utils/theme";
import Cookies from "js-cookie";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { FaUser } from "react-icons/fa6";

function Seekers({
  company,
  user,
  job,
  swiper,
  setSeekerDetailSlug,
  closeModal,
}: {
  company?: CompanyProfile | null;
  user?: UserProfile | null;
  job?: Job | null;
  swiper?: SwiperCore;
  setSeekerDetailSlug?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  closeModal?: () => void;
}) {
  const {
    isLoading,
    error,
    data: seekers,
  } = useQuery({
    queryFn: async () => {
      if (!job) return null;
      return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job?.slug}/seekers/`,
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      ).then((res) => res.json() as Promise<SeekerData>);
    },
    queryKey: ["seekers"],
    enabled: !!job,
  });

  const [cv, setCv] = useState<{ file: File | null }>({
    file: null,
  });

  const cvRef = React.useRef<HTMLInputElement>(null);

  const [transcript, setTranscript] = useState<{ file: File | null }>({
    file: null,
  });

  const transcriptRef = React.useRef<HTMLInputElement>(null);

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    if (event.target.files[0].size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB", defaultToastStyle);
      return;
    }
    setCv({
      ...cv,
      file: event.target.files[0],
    });
  };

  const handleTranscriptChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    if (event.target.files[0].size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB", defaultToastStyle);
      return;
    }
    setTranscript({ ...transcript, file: event.target.files[0] });
  };

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: user?.email || "",
      phone: "",
      comment: "",
    },
    validate: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    ),
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!job) return;
    if (!cv.file) {
      toast.error("Please upload your CV", defaultToastStyle);
      return;
    }
    if (!isPossiblePhoneNumber(form.values.phone)) {
      toast.error("Please enter a valid phone number", defaultToastStyle);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("email", form.values.email);
    formData.append("phone_number", form.values.phone);
    formData.append("other_comment", form.values.comment);
    if (cv.file) formData.append("cv", cv.file);
    if (transcript.file) formData.append("transcript", transcript.file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.slug}/create-seeker/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
        body: formData,
      }
    );

    if (res.ok) {
      toast.success(
        "Successfully submitted your application",
        defaultToastStyle
      );
      setLoading(false);
      form.reset();
      if (cvRef.current) cvRef.current.value = "";
      if (transcriptRef.current) transcriptRef.current.value = "";
      setCv({ file: null });
      setTranscript({ file: null });

      closeModal?.();
      return;
    }

    const error: Partial<
      | {
          email: string[];
          phone_number: string[];
          other_comment: string[];
          cv: string[];
          transcript: string[];
        }
      | undefined
    > = await res.json();

    toast.error(
      error?.email?.[0] ||
        error?.phone_number?.[0] ||
        error?.other_comment?.[0] ||
        error?.cv?.[0] ||
        error?.transcript?.[0] ||
        "An error occurred while submitting your application",
      defaultToastStyle
    );

    setLoading(false);
  };

  const jobSeekerDetail = async (slug: string) => {
    swiper?.slideTo(2);
    setSeekerDetailSlug?.(slug);
  };
  return (
    <>
      {company && user && company.user === user.email ? (
        <div className="slide-content md:p-4">
          {isLoading && (
            <div className="h-[90vh] relative">
              <div className="absolute top-[20%] left-2/4 -translate-x-2/4 -translate-y-2/4">
                <Loader color="violet" size={"lg"}></Loader>
              </div>
            </div>
          )}
          {!isLoading && (
            <div className="mt-4 h-[90vh] overflow-y-scroll">
              <h1 className="text-2xl font-bold mb-4">Applicants</h1>
              {seekers &&
                seekers?.results &&
                seekers?.results.map((seeker) => (
                  <div
                    key={seeker.slug}
                    onClick={() => jobSeekerDetail(seeker.slug)}
                    className="bg-gray-100 mb-6 flex gap-4 px-4 py-5 rounded-lg cursor-pointer swiper-pagination swiper-button-prev"
                  >
                    {seeker.user_profile_image ? (
                      <div className="w-24 h-24 relative">
                        <Image
                          src={seeker.user_profile_image}
                          className="rounded-full object-cover"
                          alt=""
                          fill
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 flex bg-gray-300 items-center justify-center relative rounded-full">
                        <FaUser size={60} />
                      </div>
                    )}
                    <div>
                      <h1 className="font-bold text-xl mb-2">{seeker.name}</h1>
                      <p className="mb-1">{seeker.email}</p>
                      <p className="text-base font-medium mb-2">
                        Applied {moment(seeker.date_posted).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="slide-content md:p-4">
          {/* <div className="swiper-pagination fixed -top-10 z-50 swiper-button-prev cursor-pointer flex items-center gap-2">
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
          </div> */}
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
                    className="w-[120px] text-white cursor-pointer flex items-center justify-center bg-zinc-800 rounded-md z-10 h-[45px]"
                  >
                    Upload
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    onChange={(event) => {
                      handleCvChange(event);
                    }}
                    ref={cvRef}
                    id="cv"
                  />
                  {cv.file && (
                    <div className="truncate w-40">{cv.file.name}</div>
                  )}
                  {cv.file && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      onClick={() => {
                        if (cvRef.current) cvRef.current.value = "";

                        setCv({ ...cv, file: null });
                      }}
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
                  <h3 className="font-bold">Cover Letter</h3>
                </div>
                <div className="flex gap-4 items-center">
                  <label
                    htmlFor="transcript"
                    className="w-[120px] text-white flex items-center justify-center cursor-pointer bg-zinc-800 rounded-md z-10 h-[45px]"
                  >
                    Upload
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    onChange={handleTranscriptChange}
                    id="transcript"
                    ref={transcriptRef}
                  />
                  {transcript.file && (
                    <div className="truncate w-40">{transcript.file.name}</div>
                  )}
                  {transcript.file && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      onClick={() => {
                        if (transcriptRef.current)
                          transcriptRef.current.value = "";
                        setTranscript({ ...transcript, file: null });
                      }}
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
                <TextInput
                  withAsterisk
                  label="Email"
                  variant="unstyled"
                  size="md"
                  placeholder="your@email.com"
                  key={form.key("email")}
                  classNames={{
                    wrapper: "border border-gray-300 mt-1 rounded-md px-2",
                    label: "mb-1",
                  }}
                  {...form.getInputProps("email")}
                ></TextInput>
              </div>
              <div className="mt-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base">Phone Number</h3>

                  <PhoneInput
                    placeholder="Enter phone number"
                    value={form.values.phone}
                    onChange={(value) => {
                      if (value) form.setFieldValue("phone", value);
                    }}
                    numberInputProps={{
                      className:
                        "!border-y border-gray-300 outline-none px-2 !border-r rounded-r-md !py-3",
                    }}
                    defaultCountry="GH"
                  />
                </div>
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
                size="md"
                color="dark"
                loading={loading}
                className={"py-1 mt-6 w-full px-6 !rounded-md font-bold "}
              >
                <span>Apply</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Seekers;
