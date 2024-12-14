"use client";

import { JobsData, UserProfile } from "@/types/api.types";
import React from "react";
import Job from "./Job";
import ActiveJob from "./ActiveJob";
import { useSearchParams } from "next/navigation";

function Jobs({
  jobs,
  user,
}: {
  jobs: JobsData | null;
  user?: UserProfile | null;
}) {
  return (
    <div className="">
      {jobs && jobs.results.length > 0 ? (
        <div className="md:px-20 px-5 flex justify-between mt-10">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.results.map((job) => (
              <Job user={user} key={job.slug} job={job}></Job>
            ))}
          </div>
          {/* <ActiveJob user={user}></ActiveJob> */}
        </div>
      ) : (
        <div className="text-center text-2xl font-bold mt-6">
          Sorry, No jobs available right now
        </div>
      )}
    </div>
  );
}

export default Jobs;
