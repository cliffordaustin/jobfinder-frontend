import { CompanyProfile, Job, UserProfile } from "@/types/api.types";
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React, { useState } from "react";
import { z } from "zod";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import TextEditor from "../TextEditor";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { defaultToastStyle } from "@/utils/theme";

function PostJob({
  user,
  company,
  job,
}: {
  user?: UserProfile | null;
  company?: CompanyProfile | null;
  job?: Job | null;
}) {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      firstName: job?.first_name || user?.first_name || "",
      lastName: job?.last_name || user?.last_name || "",
      workEmail: job?.work_email || user?.email || "",
      jobTitle: job?.job_title || "",
      address: job?.address || "",
      remote: job?.remote || false,
      salary: job?.salary || "",
      salaryTo: job?.salaryTo || "",
      salary_type: job?.salary_type || "yearly",
      description: job?.description || "",
      phone: job?.phone_number || "",
      isClosed: job?.is_closed || false,
    },
    validate: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    ),
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!company) return;

    if (form.values.phone && !isPossiblePhoneNumber(form.values.phone)) {
      toast.error("Invalid phone number", defaultToastStyle);
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${company.slug}/create-job/`,
        {
          first_name: form.values.firstName,
          last_name: form.values.lastName,
          work_email: form.values.workEmail,
          job_title: form.values.jobTitle,
          address: form.values.address,
          remote: form.values.remote,
          salary: Number(form.values.salary),
          salaryTo: Number(form.values.salaryTo),
          salary_type: form.values.salary_type,
          description: form.values.description,
          phone_number: form.values.phone,
          is_closed: form.values.isClosed,
        },
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      );

      setLoading(false);
      toast.success("Successfully posted job", defaultToastStyle);
      location.reload();
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Something went wrong", defaultToastStyle);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-4 p-4"
    >
      <div className="flex items-center gap-4">
        <TextInput
          label="First Name"
          variant="unstyled"
          size="md"
          className="text-black w-[50%]"
          placeholder="Enter your first name"
          key={form.key("firstName")}
          classNames={{
            input: "!text-black",
            wrapper: "border border-gray-300 mt-1 rounded-md px-2",
            label: "mb-1",
          }}
          {...form.getInputProps("firstName")}
        />

        <TextInput
          label="Last Name"
          variant="unstyled"
          size="md"
          className="text-black w-[50%]"
          placeholder="Enter your last name"
          key={form.key("lastName")}
          classNames={{
            input: "!text-black",
            wrapper: "border border-gray-300 mt-1 rounded-md px-2",
            label: "mb-1",
          }}
          {...form.getInputProps("lastName")}
        />
      </div>

      <TextInput
        withAsterisk
        label="Work email"
        variant="unstyled"
        size="md"
        className="text-black"
        placeholder="your@email.com"
        key={form.key("workEmail")}
        classNames={{
          input: "!text-black",
          wrapper: "border border-gray-300 mt-1 rounded-md px-2",
          label: "mb-1",
        }}
        {...form.getInputProps("workEmail")}
        required
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium">Phone Number</h3>

        <PhoneInput
          placeholder="Enter phone number"
          value={form.values.phone}
          onChange={(value) => {
            if (value) form.setFieldValue("phone", value);
          }}
          numberInputProps={{
            className:
              "!border-y border-gray-300 outline-none px-2 !border-r rounded-r-md !py-2",
          }}
          className="!text-black"
          defaultCountry="GH"
        />
      </div>

      <TextInput
        withAsterisk
        label="Job Title"
        variant="unstyled"
        size="md"
        className="text-black"
        placeholder="Job Title"
        key={form.key("jobTitle")}
        classNames={{
          input: "!text-black",
          wrapper: "border border-gray-300 mt-1 rounded-md px-2",
          label: "mb-1",
        }}
        {...form.getInputProps("jobTitle")}
        required
      />

      <TextInput
        label="Address"
        variant="unstyled"
        size="md"
        className="text-black"
        placeholder="Address"
        key={form.key("address")}
        classNames={{
          input: "!text-black",
          wrapper: "border border-gray-300 mt-1 rounded-md px-2",
          label: "mb-1",
        }}
        {...form.getInputProps("address")}
      />
      <Checkbox
        label="Remote"
        checked={form.values.remote}
        onChange={(event) => form.setFieldValue("remote", event.target.checked)}
      />

      <div>
        <div className="flex items-center justify-between gap-4">
          <NumberInput
            label="Salary"
            variant="unstyled"
            size="md"
            className="text-black w-full"
            placeholder="Salary"
            key={form.key("salary")}
            classNames={{
              input: "!text-black",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1",
            }}
            {...form.getInputProps("salary")}
          />

          <h1 className="font-bold mt-6"> - </h1>

          <NumberInput
            label="To"
            variant="unstyled"
            size="md"
            className="text-black w-full"
            placeholder="Salary"
            key={form.key("salaryTo")}
            classNames={{
              input: "!text-black",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1",
            }}
            {...form.getInputProps("salaryTo")}
          />
        </div>

        <Radio.Group
          value={form.values.salary_type}
          onChange={(value) => form.setFieldValue("salary_type", value)}
        >
          <Group mt={"sm"}>
            <Radio label="Yearly" value="yearly" />
            <Radio label="Monthly" value="monthly" />
            <Radio label="Weekly" value="weekly" />
            <Radio label="Hourly" value="hourly" />
          </Group>
        </Radio.Group>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center mb-2">
          <h3 className="font-bold">Job Description</h3>
        </div>

        <TextEditor
          content={form.values.description}
          onChange={(value) => form.setFieldValue("description", value)}
        ></TextEditor>
      </div>

      {job && (
        <Checkbox
          label="Close Job"
          checked={form.values.isClosed}
          onChange={(event) =>
            form.setFieldValue("isClosed", event.target.checked)
          }
        />
      )}

      <div className="flex mt-3 items-center justify-between">
        <div></div>
        <Button loading={loading} type="submit" color="dark.8">
          Post
        </Button>
      </div>
    </form>
  );
}

export default PostJob;
