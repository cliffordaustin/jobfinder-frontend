"use client";

import { CompanyProfile, JobsData, UserProfile } from "@/types/api.types";
import React, { useRef, useState } from "react";
import ProfilePic from "./ProfilePic";
import { Button, Modal, useModalsStack } from "@mantine/core";
import ImageGalleryPicker from "./ImageGalleryPicker";
import ReadMore from "../ReadMore";
import Jobs from "./Jobs";
import ImageGallery from "./ImageGallery";
import Seekers from "./Seekers";
import { useDisclosure } from "@mantine/hooks";
import CompanySetup from "./Setup";
import PostJob from "./PostJob";
import WarningModal from "../WarningModal";

function Profile({
  user,
  company,
  jobs,
}: {
  user?: UserProfile | null;
  company: CompanyProfile | null;
  jobs: JobsData | null;
}) {
  const jobsRef = useRef<HTMLDivElement>(null);

  const profileStack = useModalsStack([
    "company-profile",
    "company-profile-warning",
  ]);

  const jobsStack = useModalsStack([
    "company-profile-jobs",
    "company-profile-jobs-warning",
  ]);

  return (
    <div>
      <div className="mt-10 md:px-20 border-b-[1px] border-gray-200 py-4 px-8 flex md:flex-row flex-col md:justify-between md:items-center sm:items-center justify-center">
        <div className="flex md:flex-row flex-col gap-4 items-center justify-center">
          <ProfilePic user={user} company={company}></ProfilePic>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-center md:text-left">
              {company?.company_name}
            </h1>
            <p className="text-sm font-bold text-center md:text-left">
              Since {company?.year_started}
            </p>
            <p className="text-base font-medium md:text-left">
              About {company?.num_of_employees} employees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              profileStack.open("company-profile");
            }}
            variant="outline"
            color="dark"
            className="px-6 py-2 !rounded-md md:mt-0 mt-6 sm:w-80"
          >
            Edit profile
          </Button>
          <Button
            onClick={() => {
              if (jobsRef.current) {
                jobsRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
            color="dark.8"
            className="px-6 py-2 !rounded-md md:mt-0 mt-6 sm:w-80"
          >
            Go to jobs
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        {/* <div className="flex items-center justify-between md:px-20 px-6 mb-8 md:mt-10 mt-5">
          <div className="text-2xl font-standardTT font-bold"></div>
          <div
            onClick={() => {
              openGalleryModal();
            }}
            className="flex items-center gap-1 text-purple-600 cursor-pointer"
          >
            <span>See all images</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </div>
        </div> */}
        <ImageGalleryPicker
          images={company?.company_images}
          company={company}
        ></ImageGalleryPicker>
      </div>
      {company?.about_company && (
        <div className="flex flex-col mt-10 md:px-20 px-6">
          <div className="text-2xl mb-8 font-standardTT font-bold">
            About Company
          </div>
          <div className="md:pl-8 pl-4">
            <div className="text-base whitespace-pre-wrap">
              <ReadMore
                text={company?.about_company || ""}
                length={600}
              ></ReadMore>
            </div>
          </div>
        </div>
      )}
      {company?.company_values && (
        <div className="flex flex-col mt-10 md:px-20 px-6">
          <div className="text-2xl mb-8 font-standardTT font-bold">
            Company Values
          </div>
          <div className="md:pl-8 pl-4">
            <div className="text-base whitespace-pre-wrap">
              <ReadMore
                text={company?.company_values || ""}
                length={600}
              ></ReadMore>
            </div>
          </div>
        </div>
      )}
      {jobs && jobs.results.length > 0 ? (
        <div ref={jobsRef} className="flex flex-col mt-10 md:px-20 pl-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl mb-8 font-standardTT font-bold">
              Available jobs({jobs.results.length})
            </div>

            <Button
              color="dark.8"
              onClick={() => {
                jobsStack.open("company-profile-jobs");
              }}
            >
              Post a job
            </Button>
          </div>

          <Jobs company={company} user={user} jobs={jobs}></Jobs>
        </div>
      ) : (
        <div
          ref={jobsRef}
          className="text-xl flex flex-col justify-center items-center gap-2 font-bold text-center mt-10"
        >
          <span>No available jobs</span>
          <Button
            color="dark.8"
            onClick={() => {
              jobsStack.open("company-profile-jobs");
            }}
          >
            Post a job
          </Button>
        </div>
      )}
      <div className="mt-10 md:px-20 px-6">
        To read more about this company,{" "}
        <span className="font-bold text-purple-600">Go to company website</span>
      </div>

      <Modal.Stack>
        <Modal
          radius="md"
          size="xl"
          closeOnClickOutside={false}
          closeOnEscape={false}
          opened={profileStack.state["company-profile"]}
          onClose={() => {
            profileStack.open("company-profile-warning");
          }}
          classNames={{
            root: "!bg-white",
            content: "!bg-white !h-[500px]",
            title: "!text-black !font-semibold !text-lg",
            header: "!bg-gray-100 !border-b !border-zinc-200",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          title="Edit Profile"
          centered
        >
          <CompanySetup company={company}></CompanySetup>
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
          {...profileStack.register("company-profile-warning")}
          closeOnClickOutside={false}
          centered
        >
          <WarningModal
            onClose={() => {
              profileStack.close("company-profile-warning");
            }}
            onCloseAll={() => {
              profileStack.closeAll();
            }}
          ></WarningModal>
        </Modal>
      </Modal.Stack>

      <Modal.Stack>
        <Modal
          radius="md"
          size="xl"
          opened={jobsStack.state["company-profile-jobs"]}
          classNames={{
            root: "!bg-white",
            content: "!bg-white !h-[500px]",
            title: "!text-black !font-semibold !text-lg",
            header: "!bg-gray-100 !border-b !border-zinc-200",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          closeOnClickOutside={false}
          closeOnEscape={false}
          onClose={() => {
            jobsStack.open("company-profile-jobs-warning");
          }}
          title="Post a job"
          centered
        >
          <PostJob company={company} user={user}></PostJob>
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
          {...jobsStack.register("company-profile-jobs-warning")}
          closeOnClickOutside={false}
          centered
        >
          <WarningModal
            onClose={() => {
              jobsStack.close("company-profile-jobs-warning");
            }}
            onCloseAll={() => {
              jobsStack.closeAll();
            }}
          ></WarningModal>
        </Modal>
      </Modal.Stack>
    </div>
  );
}

export default Profile;
