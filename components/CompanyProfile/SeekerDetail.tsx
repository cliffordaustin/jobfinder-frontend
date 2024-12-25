import { CompanyProfile, Job, Seeker, UserProfile } from "@/types/api.types";
import { Button, Loader } from "@mantine/core";
import React, { useCallback } from "react";
import Parser from "html-react-parser";
import moment from "moment";
import toast from "react-hot-toast";
import { defaultToastStyle } from "@/utils/theme";
import Cookies from "js-cookie";
import { formatPhoneNumber } from "react-phone-number-input";
import Image from "next/image";

function SeekerDetail({
  company,
  user,
  job,
  slug,
  currentSlide,
}: {
  company?: CompanyProfile | null;
  user?: UserProfile | null;
  job?: Job | null;
  slug?: string;
  currentSlide?: number;
}) {
  // const {
  //   isLoading,
  //   error,
  //   data: seeker,
  // } = useQuery({
  //   queryFn: async () => {
  //     console.log("slug", slug);
  //     if (!slug) {
  //       return null;
  //     }

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/seekers/${slug}/`
  //     );

  //     console.log("seeker", await res.json());

  //     return res.json() as Promise<Seeker>;
  //   },
  //   queryKey: [`seeker-${slug}`],
  //   enabled: !!slug,
  // });

  const [isLoading, setIsLoading] = React.useState(false);

  const [seeker, setSeeker] = React.useState<Seeker | null>(null);

  const [error, setError] = React.useState(false);

  const getSeeker = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seekers/${slug}/`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setSeeker(data);
      setIsLoading(false);
      setError(false);

      return;
    }

    setIsLoading(false);
    setError(true);
    toast.error("Something went wrong", defaultToastStyle);
  }, [slug]);

  React.useEffect(() => {
    if (slug && currentSlide === 2) {
      getSeeker();
    }
  }, [slug, currentSlide, getSeeker]);

  const downloadCv = (url: string | null) => {
    if (typeof window !== "undefined" && url) {
      window.open(url, "_blank");
      window.close();
    }
  };

  const downloadTranscript = (url: string | null) => {
    if (typeof window !== "undefined" && url) {
      window.open(url, "_blank");
      window.close();
    }
  };

  return (
    <div className="slide-content">
      {company?.user === user?.email ? (
        <>
          {isLoading && (
            <div className="relative">
              <div className="absolute mt-16 left-2/4 -translate-x-2/4 -translate-y-2/4">
                <Loader size={30} />
              </div>
            </div>
          )}

          {!isLoading && !error && seeker && (
            <div className="flex mt-8 flex-col items-center">
              <div className="w-36 h-36 relative rounded-full">
                <Image
                  src={seeker?.user_profile_image}
                  alt="Image"
                  className="h-full w-full object-cover rounded-full"
                  fill
                />
              </div>
              <div className="flex flex-col items-center">
                <h1 className="lg:text-2xl text-xl font-bold mt-4">
                  {job?.job_title}
                </h1>
                <p className="text-xl mb-1 mt-2">{seeker?.name}</p>
                <p className="mb-1">
                  {seeker?.email}{" "}
                  {seeker?.phone_number &&
                    `(${formatPhoneNumber(seeker.phone_number)})`}
                </p>
                <p className="text-base font-medium">
                  Applied {moment(seeker?.date_posted).fromNow()}
                </p>
              </div>
              <div className="flex gap-5 items-center justify-center w-full mt-6">
                {seeker?.cv && (
                  <Button
                    onClick={() => downloadCv(seeker?.cv)}
                    size="md"
                    color="dark"
                    className="w-[50%] md:w-[300px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>{" "}
                    <div className="ml-2">Download CV</div>
                  </Button>
                )}
                {seeker?.transcript ? (
                  <Button
                    onClick={() => downloadTranscript(seeker?.transcript)}
                    size="md"
                    color="dark"
                    className="w-[50%] md:w-[300px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>{" "}
                    <div className="ml-2">Download Cover Letter</div>
                  </Button>
                ) : null}
              </div>
              <div>
                <h1 className="lg:text-2xl text-center text-xl font-bold mt-6">
                  Other Comment
                </h1>
                {seeker?.other_comment && (
                  <div className="mt-4 prose prose-violet">
                    {Parser(seeker.other_comment)}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default SeekerDetail;
