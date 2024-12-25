"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Container,
  Divider,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { LoginBody, SignupBody } from "@/types/auth.types";
import { toast } from "react-hot-toast";
import { defaultToastStyle } from "@/utils/theme";
import Link from "next/link";
import { useToggle } from "@mantine/hooks";
import nProgress from "nprogress";
import { signIn } from "next-auth/react";

export default function Form({
  login,
  signup,
}: {
  login?: boolean;
  signup?: boolean;
}) {
  const router = useRouter();

  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    );

  const form = useForm({
    mode: "controlled",
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    ),
  });

  const [loading, setLoading] = useState(false);

  const [value, toggle] = useToggle(["company", "intern"]);

  const handleSubmit = async () => {
    setLoading(true);
    const data: LoginBody = {
      email: form.values.email,
      password: form.values.password,
    };
    const res = await fetch("api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errMessage: string = (await res.json())?.message;
      setLoading(false);
      toast.error(errMessage, defaultToastStyle);

      return;
    }

    toast.success("Successfully logged in", defaultToastStyle);

    setLoading(false);

    nProgress.start();
    router.push("/");
  };

  const handleSignup = async () => {
    setLoading(true);
    const data: SignupBody = {
      email: form.values.email,
      first_name: form.values.firstName,
      last_name: form.values.lastName,
      password1: form.values.password,
      is_company: value === "company",
    };

    try {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errMessage: string = (await res.json())?.message;
        setLoading(false);
        toast.error(errMessage, defaultToastStyle);

        return;
      }

      toast.success("Successfully signed up", defaultToastStyle);

      setLoading(false);

      router.refresh();

      if (value === "company") {
        nProgress.start();
        router.push("/company-setup");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong", defaultToastStyle);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <div className="flex w-full">
      <div className="w-full">
        <h1 className="text-3xl text-black font-bold mb-5 text-center">
          {login
            ? "Login to your account"
            : signup
            ? "Create an account"
            : "A new way of finding a job"}
        </h1>

        <form
          onSubmit={form.onSubmit(() => {
            if (login) {
              handleSubmit();
            } else if (signup) {
              handleSignup();
            }
          })}
        >
          {signup && (
            <Container className="my-4 bg-black/5 h-[45px] p-2 relative w-full flex rounded-lg">
              <Container
                className={
                  "absolute transition-all duration-300 cursor-pointer top-2/4 -translate-y-2/4 h-[80%] w-[50%] z-10 bg-black/10 backdrop-blur-2xl rounded-lg " +
                  (value === "company" ? "left-2" : "right-2")
                }
              ></Container>
              <Text
                fw={600}
                className="w-[50%] text-center cursor-pointer z-20"
                // c="dark.6"
                onClick={() => {
                  toggle();
                }}
              >
                Company Account
              </Text>
              <Text
                fw={600}
                className="w-[50%] text-center cursor-pointer z-20"
                // c="dark.6"
                onClick={() => {
                  toggle();
                }}
              >
                Intern Account
              </Text>
            </Container>
          )}
          {signup && (
            <div className="flex items-center gap-4 mb-4">
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
          )}
          <TextInput
            withAsterisk
            label="Email"
            variant="unstyled"
            size="md"
            className="text-black"
            placeholder="your@email.com"
            key={form.key("email")}
            classNames={{
              input: "!text-black",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1",
            }}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            variant="unstyled"
            size="md"
            className="text-black mt-4"
            placeholder="Password"
            key={form.key("password")}
            classNames={{
              input: "!text-black",
              wrapper: "border border-gray-300 mt-1 rounded-md px-2",
              label: "mb-1",
            }}
            required={true}
            {...form.getInputProps("password")}
          ></PasswordInput>

          <div className="flex items-center justify-between w-full">
            <div></div>

            <Text
              size="sm"
              c="dimmed"
              className="cursor-pointer hover:underline"
              mt={2}
            >
              Forgot Password?
            </Text>
          </div>

          <div className="flex flex-col w-full">
            <Button
              type="submit"
              color="dark.8"
              radius="md"
              variant="outline"
              loading={loading}
              size="md"
              className={"mt-5 w-full " + (loading ? "opacity-60" : "")}
            >
              {signup ? "Sign Up" : "Login to your account"}
            </Button>

            <Button
              color="dark"
              size="md"
              radius="md"
              className="mt-3 w-full flex justify-center items-center gap-2"
              onClick={async () => {
                try {
                  setGoogleLoading(true);
                  await signIn("google");
                  nProgress.start();
                  router.push("/");
                } catch (error) {
                  setGoogleLoading(false);
                  console.log(error);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                width="24px"
                height="24px"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              <span className="ml-2">Sign in with Google</span>
            </Button>
          </div>
        </form>
        <Divider my="sm" label="Or" labelPosition="center" />
        <div className="flex justify-center items-center gap-1 mt-3">
          <Text size="sm" c="dimmed" mt={2}>
            {signup ? "Already have an account?" : "Don't have an account?"}
          </Text>
          {signup ? (
            <Link href="/login">
              <Text
                className="cursor-pointer hover:underline"
                size="sm"
                c="dark.3"
                fw={700}
              >
                Login
              </Text>
            </Link>
          ) : (
            <Link href="/signup">
              <Text
                className="cursor-pointer hover:underline"
                size="sm"
                c="dark.3"
                fw={700}
              >
                Sign up
              </Text>
            </Link>
          )}
        </div>
      </div>
      {/* <div className="lg:w-2/4">
        <img className="w-full h-full" src="./images/image2.svg" alt="" />
      </div> */}
    </div>
  );
}
