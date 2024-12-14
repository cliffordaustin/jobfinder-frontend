"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

type ItemsProps = {
  title: string;
  text: string;
  children: React.ReactNode;
};

const Items = ({ title, text, children }: ItemsProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [itemMouseOver, setItemMouseOver] = React.useState(false);

  return (
    <section
      ref={ref}
      onMouseOver={() => setItemMouseOver(true)}
      onMouseLeave={() => setItemMouseOver(false)}
      className="md:w-[425px] rounded-md bg-zinc-800 p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 blur-sm"></div>
      <motion.div
        initial={{
          width: 350,
          height: 350,
        }}
        animate={{
          width: itemMouseOver ? 700 : 350,
          height: itemMouseOver ? 700 : 350,
        }}
        transition={{
          duration: 0.5,
        }}
        className="absolute -top-[200px] -left-[150px] rounded-full bg-white/5 blur-xl"
      ></motion.div>
      <div className="flex flex-col text-white gap-4">
        {children}
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-base">{text}</p>
      </div>
      <Link href="#">
        <Button className="mt-5" color="dark">
          Learn More
        </Button>
      </Link>

      <div className="w-full h-[10px] bg-zinc-700 absolute bottom-0 right-0 left-0"></div>
    </section>
  );
};

export default Items;
