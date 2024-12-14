import { getJobs } from "@/actions/jobs";
import { getUserProfile } from "@/actions/userProfile";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/Jobs/SearchFilter";
import NavbarComponent from "@/components/Navbar/Primary";
import React from "react";
import JobsComponent from "../../components/Jobs/Jobs";

async function Jobs() {
  const jobs = await getJobs();
  let user = await getUserProfile();

  return (
    <div className="text-white">
      <NavbarComponent user={user?.[0]}></NavbarComponent>
      <div className="w-[1200px] mx-auto">
        <SearchFilter></SearchFilter>
        <JobsComponent jobs={jobs} user={user?.[0]}></JobsComponent>
      </div>
      <div className="mt-12">
        <Footer></Footer>
      </div>
    </div>
  );
}

export default Jobs;
