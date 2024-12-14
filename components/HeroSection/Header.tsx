import { Button } from "@mantine/core";
import React from "react";

function Header() {
  return (
    <header className="flex md:flex-row flex-col justify-between items-center px-8 md:px-12 mt-10 overflow-hidden">
      <div className="w-full md:w-[60%]">
        <h1 className={"font-bold text-white text-3xl md:text-5xl mb-6 "}>
          Start building your team just with a click
        </h1>
        <Button color="dark">Hire an intern</Button>
      </div>
      <div className="w-full md:w-2/5 md:relative md:-mr-20">
        <div className="w-600 h-600 circle-gradient rounded-full hidden md:block"></div>
        <div className="md:mt-0 mt-6 md:px-6 px-3 py-4 flex flex-col items-center gap-1 rounded-lg circle-gradient lg:w-500 md:absolute md:top-40 md:-left-52">
          <div className="w-20 h-20 rounded-full">
            <img
              className="w-20 h-20 rounded-full object-cover"
              src="./images/image1.jpg"
              alt=""
            />
          </div>
          <h3 className="text-white">Software engineers</h3>
          <h4 className="text-white font-bold">@Marco</h4>
          <p className="text-white">
            Came accross Job finder about 6 months ago and I decided to apply
            for an internship in one of the many software companies in the
            platform. Came accross Marco, read about the companies and the
            values and saw some images on the company. Was very pleased on what
            I saw so I applied. A week later I got the job. four months into
            working as an intern, I am now a software engineer
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
