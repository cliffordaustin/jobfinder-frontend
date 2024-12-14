import { getCompanyProfile } from "@/actions/companyProfile";
import { getJobs } from "@/actions/jobs";
import { getUserProfile } from "@/actions/userProfile";
import Profile from "@/components/CompanyProfile/Profile";
import Footer from "@/components/Footer";
import NavbarComponent from "@/components/Navbar/Primary";
import React from "react";

async function CompanyProfile() {
  const user = await getUserProfile();
  const company = await getCompanyProfile();
  const jobs = await getJobs(company?.slug);

  return (
    <div className="text-white">
      <NavbarComponent user={user?.[0]}></NavbarComponent>
      <Profile user={user?.[0]} company={company} jobs={jobs}></Profile>
      <div className="mt-20">
        <Footer></Footer>
      </div>
    </div>
  );
}

export default CompanyProfile;
