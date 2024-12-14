"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import TextEditor from "../TextEditor";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { Button, TextInput } from "@mantine/core";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import Select from "react-select";

import "swiper/css";
import SwiperCore from "swiper";
import ImageUpload from "./ImageUpload";
import { values } from "lodash";
import { CompanyProfile } from "@/types/api.types";

function CompanySetup({ company }: { company?: CompanyProfile | null }) {
  const [state, setState] = useState({
    swiperIndex: 0,
    endOfSlide: false,
    setupError: false,
    loading: false,
  });

  const router = useRouter();

  const employees = [
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1000+", label: "1000+" },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState<{
    value: string;
    label: string;
  } | null>({
    value: company?.num_of_employees || "1-10",
    label: company?.num_of_employees || "1-10",
  });

  const form = useForm({
    initialValues: {
      companyName: company?.company_name || "",
      yearStarted: company?.year_started?.toString() || "",
      aboutCompany: company?.about_company || "",
      companyValues: company?.company_values || "",
    },
    validate: zodResolver(
      z.object({
        companyName: z.string().max(500, "This field has a max lenght of 500"),
        yearStarted: z.string(),
        aboutCompany: z.string(),
        companyValues: z.string(),
      })
    ),
  });

  const handleSubmit = async () => {
    setState({ ...state, loading: true });
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-company-profile/`,
        {
          company_name: form.values.companyName,
          num_of_employees: selectedEmployee?.value,
          year_started: Number(form.values.yearStarted),
          about_company: form.values.aboutCompany,
          company_values: form.values.companyValues,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      setState({ ...state, loading: false });
      swiper?.slideNext();
    } catch (error) {
      setState({ ...state, setupError: true, loading: false });
    }
  };

  const handleEdit = async () => {
    if (!company) return;

    setState({ ...state, loading: true });

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/company-profiles/${company.slug}/`,
        {
          company_name: form.values.companyName,
          num_of_employees: selectedEmployee?.value,
          year_started: Number(form.values.yearStarted),
          about_company: form.values.aboutCompany,
          company_values: form.values.companyValues,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      setState({ ...state, loading: false });
      location.reload();
    } catch (error) {
      setState({ ...state, setupError: true, loading: false });
    }
  };

  const [swiper, setSwiper] = useState<SwiperCore>();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  return (
    <div className="flex text-white relative">
      {!company && (
        <div className="lg:w-2/4 fixed left-0 top-0 bottom-0 lg:block hidden flex-col justify-between">
          <div className="h-full relative w-full">
            <Image sizes="100vw" fill src="/images/building.jpg" alt="" />
          </div>

          <div className="w-full absolute z-10 left-0 top-0 bottom-0 bg-black/50"></div>
        </div>
      )}

      <Swiper
        preventInteractionOnTransition={true}
        allowTouchMove={false}
        noSwiping={true}
        autoHeight={true}
        onSwiper={(swiper) => {
          setSwiper(swiper);
        }}
        className={
          "!pb-36 !absolute !right-0 w-full " +
          (company ? "w-full" : "lg:w-2/4")
        }
      >
        <SwiperSlide>
          {!company && (
            <div className="p-4 border-b border-gray-300">
              <h1 className="text-3xl md:px-10 sm:px-5 px-2 font-bold">
                Build your profile to attract more Interns.
              </h1>
            </div>
          )}

          <form
            onSubmit={form.onSubmit(() => {
              if (company) {
                handleEdit();
              } else {
                handleSubmit();
              }
            })}
            className="px-8 flex flex-col gap-3 mt-4"
          >
            <TextInput
              withAsterisk
              label="Company name"
              variant="unstyled"
              size="lg"
              className="text-white"
              placeholder="Company Name"
              key={form.key("companyName")}
              classNames={{
                input: "!text-white",
                wrapper: "border border-gray-300 mt-1 rounded-md px-2",
                label: "mb-1",
              }}
              {...form.getInputProps("companyName")}
              required
            />

            <TextInput
              withAsterisk
              label="Year started"
              variant="unstyled"
              type="number"
              size="lg"
              className="text-white"
              placeholder="Year Started"
              key={form.key("yearStarted")}
              classNames={{
                input: "!text-white",
                wrapper: "border border-gray-300 mt-1 rounded-md px-2",
                label: "mb-1",
              }}
              {...form.getInputProps("yearStarted")}
              required
            />

            {isMounted && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-bold">Number of employees</h3>
                </div>

                <Select
                  onChange={(val) => {
                    setSelectedEmployee(val);
                  }}
                  menuPortalTarget={document.body}
                  classNames={{
                    menu(state) {
                      return "!bg-zinc-700 !z-20";
                    },

                    control(state) {
                      return state.isFocused
                        ? "!outline-none !text-white !text-lg !border-gray-300 !bg-zinc-900 p-1.5"
                        : "!text-white !text-lg !border-gray-300 !bg-zinc-900 p-1.5";
                    },

                    input(state) {
                      return "!text-white";
                    },

                    option(state) {
                      return state.isSelected
                        ? "!bg-zinc-900 cursor-pointer !text-white"
                        : state.isFocused
                        ? "!bg-zinc-800 cursor-pointer !text-white"
                        : "!text-white";
                    },

                    singleValue(state) {
                      return "!text-gray-200";
                    },
                  }}
                  value={selectedEmployee}
                  options={employees}
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <div className="flex items-center mb-2">
                <h3 className="font-bold">About company</h3>
              </div>

              <TextEditor
                content={form.values.aboutCompany}
                onChange={(value) => form.setFieldValue("aboutCompany", value)}
              ></TextEditor>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center mb-2">
                <h3 className="font-bold">Company values</h3>
              </div>

              <TextEditor
                content={form.values.companyValues}
                onChange={(value) => form.setFieldValue("companyValues", value)}
              ></TextEditor>
            </div>

            <div className="flex items-center justify-between">
              <div></div>

              <Button
                type="submit"
                loading={state.loading}
                color="dark"
                size="md"
              >
                Save
              </Button>
            </div>
          </form>
        </SwiperSlide>

        <SwiperSlide>
          <ImageUpload />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default CompanySetup;
