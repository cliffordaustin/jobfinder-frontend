"use client";

import { Button, Menu, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";

function SearchFilter() {
  const [job, setJob] = useState({
    name: "",
    location: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };
  return (
    <div className="lg:px-20 px-5 py-6 flex flex-col justify-center">
      <div className="self-center w-full flex sm:flex-row flex-col items-center gap-5 mb-5">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button color="dark" leftSection={<FaRegCalendarAlt />}>
              Date Posted
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item color="dark">Last 24 hours</Menu.Item>
            <Menu.Item color="dark">Last 3 days</Menu.Item>
            <Menu.Item color="dark">Last 7 days</Menu.Item>

            <Menu.Item>Last 14 days</Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button color="dark" leftSection={<IoFilter />}>
              On-site/Remote
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>Remote</Menu.Item>
            <Menu.Item>On-site</Menu.Item>
            <Menu.Item>Hybrid</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div></div>
      <div className="flex md:flex-row flex-col items-center justify-center md:gap-10 gap-4">
        <div className="md:w-2/5 w-full">
          <TextInput
            name="name"
            variant="unstyled"
            size="md"
            className="text-white"
            value={job.name}
            placeholder="Search jobs"
            classNames={{
              input: "!text-white",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1",
            }}
            onChange={onChange}
          ></TextInput>
        </div>
        <div className="md:w-2/5 w-full">
          <TextInput
            name="location"
            variant="unstyled"
            size="md"
            className="text-white"
            value={job.location}
            classNames={{
              input: "!text-white",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1",
            }}
            placeholder="Search City, Region or Town"
            onChange={onChange}
          ></TextInput>
        </div>
        <Button size="md" color="dark">
          Find a job
        </Button>
      </div>
    </div>
  );
}

export default SearchFilter;
