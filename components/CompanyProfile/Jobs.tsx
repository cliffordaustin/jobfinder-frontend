import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import { CompanyProfile, Job, JobsData, UserProfile } from "@/types/api.types";
import moment from "moment";
import { Button, Modal, useModalsStack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SwiperCore from "swiper";
import JobComponent from "./Job";
import WarningModal from "../WarningModal";
import useMobile from "@/utils/useMobile";

function Jobs({
  jobs,
  company,
  user,
}: {
  jobs?: JobsData | null;
  company?: CompanyProfile | null;
  user?: UserProfile | null;
}) {
  const settings = {
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const [state, setState] = React.useState({
    allowSlideNext: false,
    swiperIndex: 0,
  });

  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState<number | undefined>(0);

  const [swiper, setSwiper] = React.useState<SwiperCore>();

  const stack = useModalsStack(["job-modal", "warning-modal"]);

  const isMobile = useMobile();
  return (
    <Swiper
      {...settings}
      slidesPerView="auto"
      onSwiper={(swiper) =>
        setState({
          ...state,
          allowSlideNext: swiper.allowSlideNext,
        })
      }
      onSlideChange={(swiper) =>
        setState({ ...state, swiperIndex: swiper.realIndex })
      }
      className="!w-full md:!pl-10 !pl-5"
    >
      {jobs?.results.map((job) => (
        <SwiperSlide
          key={job.slug}
          className="px-5 py-5 shadow-lg bg-gray-100 rounded-xl !w-72"
        >
          <h1 className="text-xl truncate mb-2 font-bold">{job.job_title}</h1>
          <p className="text-base truncate">
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
            <p className="text-base text-purple-600 font-bold">No applicants</p>
          )}
          <div className="mt-10">
            <p className="text-base font-medium mb-2">
              Posted {moment(job.date_posted).fromNow()}
            </p>

            <Button
              onClick={() => {
                setSelectedJob(job);
                stack.open("job-modal");
              }}
              color="dark"
              className="w-full rounded-md"
            >
              View Job
            </Button>
          </div>
        </SwiperSlide>
      ))}
      <div
        className={
          "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 md:left-6 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-10 h-10 rounded-full bg-white shadow-lg " +
          (state.swiperIndex === 0 ? "invisible" : "")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div
        className={
          "absolute cursor-pointer flex items-center justify-center top-2/4 z-10 md:right-6 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-10 h-10 rounded-full bg-white shadow-lg " +
          (!state.allowSlideNext ? "invisible" : "")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <Modal.Stack>
        <Modal
          radius="md"
          opened={stack.state["job-modal"]}
          onClose={() => {
            stack.open("warning-modal");
          }}
          closeOnClickOutside={false}
          closeOnEscape={false}
          title={
            currentSlide === 1 || currentSlide === 2 ? (
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
                <h3 className="font-bold text-purple-600">
                  {currentSlide === 1
                    ? "Job Info"
                    : currentSlide === 2
                    ? "Applicants"
                    : ""}
                </h3>
              </div>
            ) : (
              <></>
            )
          }
          classNames={{
            root: "!bg-white",
            content: "!bg-white h-full md:!h-[500px]",
            header: "!bg-gray-100 !border-b !border-zinc-200",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          size={1100}
          fullScreen={isMobile}
          keepMounted
          centered
        >
          <JobComponent
            company={company}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            user={user}
            setSwiper={setSwiper}
            swiper={swiper}
            job={selectedJob}
          ></JobComponent>
        </Modal>

        <Modal
          radius="md"
          classNames={{
            root: "!bg-white",
            content: "!bg-white",
            title: "!font-bold",
            header: "!bg-gray-100 !border-b !border-zinc-200",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          size="sm"
          title="Are you sure?"
          {...stack.register("warning-modal")}
          closeOnClickOutside={false}
          centered
        >
          <WarningModal
            onClose={() => {
              stack.close("warning-modal");
            }}
            onCloseAll={() => {
              setCurrentSlide(0);
              swiper?.slideTo(0, 0);
              stack.closeAll();
            }}
          ></WarningModal>
        </Modal>
      </Modal.Stack>
    </Swiper>
  );
}

export default Jobs;
