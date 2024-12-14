import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import SwiperCore from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { CompanyProfile, CompanyProfileImages } from "@/types/api.types";
import Image from "next/image";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal } from "@mantine/core";
import ImageUpload from "./ImageUpload";

SwiperCore.use([FreeMode, Navigation, Thumbs]);

function ImageGalleryPicker({
  images,
  company,
}: {
  images?: CompanyProfileImages[];
  company?: CompanyProfile | null;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>();
  const [allowGallerySlideNext, setAllowGallerySlideNext] = useState(false);
  const [gallerySwiperIndex, setGallerySwiperIndex] = useState(0);

  const [allImages, setAllImages] = useState<
    CompanyProfileImages[] | undefined
  >(images);

  const settings = {
    spaceBetween: 10,
    autoHeight: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const [opened, { open: open, close: close }] = useDisclosure(false);

  return (
    <>
      {allImages && allImages.length > 0 ? (
        <div className="my-2 flex items-center justify-between w-full max-w-[1000px] mx-auto">
          <div></div>
          <Button
            onClick={() => {
              open();
            }}
            color="dark"
            className="px-6 py-2 !rounded-md md:mt-0 mt-6 sm:w-80"
          >
            {allImages && allImages.length > 0
              ? "Edit images"
              : "Upload images"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-[1000px] mx-auto">
          <h1 className="text-xl font-bold text-center">No images</h1>
          <Button
            onClick={() => {
              open();
            }}
            color="dark"
            className="px-6 py-2 !rounded-md md:mt-0 mt-6 sm:w-80"
          >
            Upload images
          </Button>
        </div>
      )}
      <Swiper
        {...settings}
        onSwiper={(swiper) => setAllowGallerySlideNext(swiper.allowSlideNext)}
        onSlideChange={(swiper) => setGallerySwiperIndex(swiper.realIndex)}
        thumbs={{ swiper: thumbsSwiper }}
        className="!mb-4 relative select-none w-full lg:w-[1000px] mx-auto"
      >
        {allImages?.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full !h-[430px]">
              <Image
                className="select-none object-cover"
                src={image.image}
                alt="Image Gallery"
                fill
              />
            </div>

            <div className="my-2 z-[999] text-white font-bold">
              {image.comment}
            </div>
          </SwiperSlide>
        ))}
        <div
          className={
            "absolute hidden md:flex cursor-pointer select-none items-center justify-center top-2/4 z-50 left-6 -translate-y-2/4 swiper-pagination swiper-button-prev w-10 h-10 rounded-full bg-white shadow-lg " +
            (gallerySwiperIndex === 0 ? "invisible" : "")
          }
        >
          <MdOutlineChevronLeft className="text-xl text-black" />
        </div>
        <div
          className={
            "absolute hidden cursor-pointer md:flex select-none items-center justify-center top-2/4 z-50 right-6 -translate-y-2/4 swiper-pagination swiper-button-next w-10 h-10 rounded-full bg-white shadow-lg " +
            (!allowGallerySlideNext ? "invisible" : "")
          }
        >
          <MdOutlineChevronRight className="text-xl text-black" />
        </div>
      </Swiper>
      <Swiper
        onSwiper={(swiper) => {
          setThumbsSwiper(swiper);
        }}
        spaceBetween={10}
        slidesPerView={"auto"}
        freeMode={true}
        watchSlidesProgress={true}
        className="image-picker-container cursor-grab select-none max-w-[1000px]"
      >
        {allImages?.map((image) => (
          <SwiperSlide
            key={image.id}
            className="!h-32 relative sm:!w-72 !w-52 !overflow-hidden select-none"
          >
            <Image
              className="image-gallery-picker object-cover"
              src={image.image}
              alt="Image Gallery"
              fill
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal
        color="dark"
        radius="lg"
        size="xl"
        opened={opened}
        classNames={{
          root: "!bg-zinc-800",
          content: "!bg-zinc-900 !h-[500px]",
          title: "!text-white !font-semibold !text-lg",
          header: "!bg-zinc-800 !border-b !border-zinc-600",
          close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
        }}
        onClose={close}
        title="Edit Profile"
        centered
      >
        <ImageUpload
          setAllImages={setAllImages}
          allImages={allImages}
          company={company}
        ></ImageUpload>
      </Modal>
    </>
  );
}

export default ImageGalleryPicker;
