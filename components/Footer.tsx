import React from "react";
import Logo from "./Navbar/Logo";
import { FaFacebookF } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";

export default function Footer() {
  return (
    <div className="flex bg-gray-100 text-black flex-col py-8 md:items-center md:px-0 sm:px-20 px-10">
      <div className="mb-10">
        <Logo type="large"></Logo>
      </div>
      <div className="flex md:flex-row flex-col md:gap-16 gap-10">
        <div>
          <h1 className="font-bold md:mb-8 mb-2">Job finder</h1>
          <h3>About</h3>
          <h3>Blog</h3>
          <h3>Contact us</h3>
          <h3>Guides</h3>
        </div>

        <div>
          <h1 className="font-bold md:mb-8 mb-2">Employers</h1>
          <h3>Get a Free Company Account</h3>
          <h3>Employer Center</h3>
          <h3>Post a Job</h3>
        </div>
        <div>
          <h1 className="font-bold md:mb-8 mb-2">Community</h1>
          <h3>Help / Contact Us</h3>
          <h3>Guidelines</h3>
          <h3>Terms of Use</h3>
          <h3>Privacy & Cookies</h3>
          <h3>Privacy Center</h3>
        </div>
        <div>
          <h1 className="font-bold md:mb-8 mb-2">Work With Us</h1>
          <h3>Advertisers</h3>
          <h3>Developers</h3>
          <h3>Careers</h3>
        </div>
      </div>
      <div className="flex gap-4 items-center mt-10">
        <FaFacebookF className="text-xl"></FaFacebookF>
        <BsTwitterX className="text-xl"></BsTwitterX>
        <AiFillInstagram className="text-3xl"></AiFillInstagram>
      </div>
    </div>
  );
}
