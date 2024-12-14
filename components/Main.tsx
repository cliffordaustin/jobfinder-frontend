"use client";

import React from "react";
import Items from "./Home/Items";
import useMouseMove from "../utils/useMouseMove";

function Main() {
  return (
    <div className="flex overflow-hidden py-10 md:py-0 md:flex-row flex-col md:gap-6 gap-6 md:px-10 px-8 justify-between mt-16 md:mt-20 mb-10">
      <Items
        title="Profile Based Choice"
        text="We at job finder believe in the mentality of knowing a company before getting in, that's why we created an easy way of getting to know about a company before applying"
      >
        <p></p>
      </Items>
      <Items
        title="Hire a student"
        text="Most companies are looking for students who are eager to learn more and want to grow their knowledge in a more pratical way; that is why we created job finder; to bring students like that to your company"
      >
        <p></p>
      </Items>
      <Items
        title="Make a change"
        text="There are a lot of young people in Ghana who are eager to grow their skills in a more practical way. The more we as a company give those young minds the opportunity the more we are building a better Ghana"
      >
        <p></p>
      </Items>
    </div>
  );
}

export default Main;
