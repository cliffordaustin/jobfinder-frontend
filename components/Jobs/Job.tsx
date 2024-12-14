"use client";

import { Job as JobType, UserProfile } from "@/types/api.types";
import React, { useEffect } from "react";
import moment from "moment";
import SwiperCore from "swiper";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import JobComponent from "../CompanyProfile/Job";
import { FaUser } from "react-icons/fa6";

function Job({ job, user }: { job: JobType; user?: UserProfile | null }) {
  const router = useRouter();

  const params = useSearchParams();

  const [opened, { open, close }] = useDisclosure(false);

  const [currentSlide, setCurrentSlide] = React.useState<number | undefined>(0);

  const [swiper, setSwiper] = React.useState<SwiperCore>();

  return (
    <>
      <div
        onClick={() => {
          // router.push(`/jobs?v=${job.slug}`);
          open();
        }}
        className={
          "px-6 py-4 rounded-md bg-zinc-800 flex flex-col sm:flex-row lg:flex-col items-center cursor-pointer w-full "
        }
      >
        {job.company_profile_image ? (
          <div className="w-24 h-24 relative lg:w-28 lg:h-28 lg:mb-4 sm:mb-0 mb-4 sm:mr-6 lg:mr-0 sm:w-32 sm:h-32 rounded-full">
            <Image
              src={job.company_profile_image}
              alt="Image"
              className="h-full w-full object-cover rounded-full"
              fill
            />
          </div>
        ) : (
          <div className="w-36 h-36 flex bg-gray-300 items-center justify-center relative rounded-full">
            <FaUser size={90} />
          </div>
        )}
        <div className="mt-2 self-start">
          <div className="mb-4">
            <h1 className="text-xl font-bold">{job.company_name}</h1>
            <p className="text-base">{job.job_title}</p>
          </div>
          <div>
            <p className="text-base">
              {job.remote && job.address
                ? job.address + "(Remote)"
                : job.remote && !job.address
                ? "Remote"
                : !job.remote && job.address
                ? job.address
                : "No address data"}
            </p>
            {job.num_applicants > 0 ? (
              <p className="text-base text-purple-600 font-bold">
                {job.num_applicants} Applicants
              </p>
            ) : (
              <p className="text-base text-purple-600 font-bold">
                No applicants
              </p>
            )}
          </div>
          <p className="text-base mt-4 font-medium mb-2">
            Posted {moment(job.date_posted).startOf("hour").fromNow()}
          </p>
        </div>
      </div>
      <Modal
        radius="lg"
        opened={opened}
        onClose={() => {
          setCurrentSlide(0);
          close();
        }}
        title={
          currentSlide === 1 ? (
            <div
              onClick={() => {
                swiper?.slidePrev();
              }}
              className="swiper-pagination swiper-button-prev cursor-pointer flex items-center gap-2 mt-2"
            >
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
          ) : (
            <></>
          )
        }
        classNames={{
          root: "!bg-zinc-800",
          content: "!bg-zinc-800",
          header: "!bg-zinc-800 !border-b !border-zinc-600",
          close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
        }}
        size={1100}
        centered
      >
        <JobComponent
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          user={user}
          setSwiper={setSwiper}
          swiper={swiper}
          job={job}
        ></JobComponent>
      </Modal>
    </>
  );
}

export default Job;
