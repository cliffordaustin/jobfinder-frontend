import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import SwiperCore from "swiper";
import Parser from "html-react-parser";
import { CompanyProfile, Job as JobType, UserProfile } from "@/types/api.types";
import moment from "moment";
import { Button } from "@mantine/core";
import Seekers from "./Seekers";
import SeekerDetail from "./SeekerDetail";
import Image from "next/image";
import { FaUser } from "react-icons/fa6";
import { formatPhoneNumber } from "react-phone-number-input";

function Job({
  company,
  job,
  user,
  currentSlide,
  setCurrentSlide,
  swiper,
  setSwiper,
  closeModal,
}: {
  company?: CompanyProfile | null;
  job?: JobType | null;
  user?: UserProfile | null;
  currentSlide?: number;
  setCurrentSlide?: React.Dispatch<React.SetStateAction<number | undefined>>;
  swiper?: SwiperCore;
  setSwiper?: (swiper: SwiperCore) => void;
  closeModal?: () => void;
}) {
  const [seekerDetailSlug, setSeekerDetailSlug] = useState<string | undefined>(
    ""
  );
  return (
    <Swiper
      allowTouchMove={false}
      autoHeight={false}
      onSwiper={(swiper) => {
        setSwiper?.(swiper);
      }}
      onSlideChange={(swiper) => {
        setCurrentSlide?.(swiper.activeIndex);
      }}
      pagination={{
        el: ".swiper-pagination",
        clickable: true,
      }}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      className="!text-black !h-[75vh]"
    >
      <SwiperSlide className="w-full p-4 overflow-y-auto">
        <div className="flex justify-center flex-col gap-4 items-center">
          {job?.company_profile_image ? (
            <div className="w-36 h-36 relative rounded-full">
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
          <div className="flex flex-col items-center gap-2">
            <h1 className="lg:text-2xl text-xl font-bold">{job?.job_title}</h1>
            <p className="truncate text-lg">
              {job?.remote && job?.address
                ? job?.address + "(Remote)"
                : job?.remote && !job?.address
                ? "Remote"
                : !job?.remote && job?.address
                ? job?.address
                : "No address data"}
            </p>
            {job && job.num_applicants > 0 ? (
              <p className="text-base text-violet-600 font-bold">
                {job?.num_applicants} Applicants
              </p>
            ) : (
              <p className="text-base text-violet-600 font-bold">
                No applicants
              </p>
            )}
            <p className="text-base font-medium">
              Posted {moment(job?.date_posted).fromNow()}
            </p>
          </div>
        </div>
        <div className="flex gap-5 w-full justify-center items-center mt-6">
          {company && user && company.user === user.email ? (
            <Button
              onClick={() => {
                swiper?.slideTo(1);
              }}
              color="dark"
              size="md"
              className="swiper-pagination swiper-button-next px-6 py-2 !rounded-md"
            >
              View who has applied
            </Button>
          ) : (
            <Button
              onClick={() => {
                swiper?.slideTo(1);
              }}
              color="dark"
              size="md"
              className="swiper-pagination swiper-button-next px-6 py-2 !rounded-md"
            >
              Apply for this job
            </Button>
          )}

          <Button
            size="md"
            color="dark"
            className="py-2 px-2 !rounded-md font-bold"
          >
            Save
          </Button>
        </div>
        {job?.description && (
          <div className="prose mt-10 prose-violet max-w-full">
            {Parser(job.description)}
          </div>
        )}
        <div className="flex flex-wrap mt-12">
          <div className="w-2/4 px-4 py-2 rounded-md border-l-4 border-purple-600">
            <h3 className="font-bold text-lg">Salary</h3>
            {job?.salary ? (
              <p className="mt-2">
                GH¢{job?.salary} {job.salaryTo ? " - " : ""}{" "}
                {job.salaryTo || ""} {job.salary_type}
              </p>
            ) : (
              <p className="mt-2">No data</p>
            )}
          </div>
          <div className="w-2/4 px-4 py-2 rounded-md border-l-4 border-purple-600">
            <h3 className="font-bold text-lg">Posted by,</h3>
            <p className="mt-2">
              {job?.first_name} {""} {job?.last_name}
            </p>
          </div>
          <div className="w-2/4 px-4 py-2 mt-4 rounded-md border-l-4 border-purple-600">
            <h3 className="font-bold text-lg">Phone Number</h3>
            {job?.phone_number ? (
              <p className="mt-2 truncate">
                {formatPhoneNumber(job.phone_number)}
              </p>
            ) : (
              "No data"
            )}
          </div>
          <div className="w-2/4 px-4 py-2 mt-4 rounded-md border-l-4 border-purple-600">
            <h3 className="font-bold text-lg">Email address</h3>
            <p className="mt-2 truncate">{job?.work_email}</p>
          </div>
        </div>
        <div className="mt-10 font-bold">
          If you have a problem with the job,{" "}
          <span className="font-bold text-purple-600 cursor-pointer">
            Report it here
          </span>
        </div>
      </SwiperSlide>

      <SwiperSlide className="w-full p-4 relative">
        <Seekers
          swiper={swiper}
          company={company}
          job={job}
          user={user}
          setSeekerDetailSlug={setSeekerDetailSlug}
          closeModal={closeModal}
        ></Seekers>
      </SwiperSlide>

      <SwiperSlide className="w-full p-4 relative">
        <SeekerDetail
          company={company}
          user={user}
          job={job}
          slug={seekerDetailSlug}
          currentSlide={currentSlide}
        ></SeekerDetail>
      </SwiperSlide>
    </Swiper>
  );
}

export default Job;
