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
import { Button, Modal, useModalsStack } from "@mantine/core";
import ImageUpload from "./ImageUpload";
import WarningModal from "../WarningModal";

function ImageGalleryPicker({
  images,
  company,
}: {
  images?: CompanyProfileImages[];
  company?: CompanyProfile | null;
}) {
  SwiperCore.use([FreeMode, Navigation, Thumbs]);

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

  const stack = useModalsStack(["gallery-modal", "warning-modal"]);

  return (
    <>
      {allImages && allImages.length > 0 ? (
        <div className="my-2 flex items-center justify-between w-full max-w-[1000px] mx-auto">
          <div></div>
          <Button
            onClick={() => {
              stack.open("gallery-modal");
            }}
            color="dark"
            variant="outline"
            className="px-6 py-2 !rounded-md md:mt-0 mt-6 sm:w-80"
          >
            {allImages && allImages.length > 0
              ? "Edit images"
              : "Upload images"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-[1000px] mx-auto">
          <h1 className="text-xl font-bold text-black text-center">
            No images
          </h1>
          <Button
            onClick={() => {
              stack.open("gallery-modal");
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

            <div className="my-2 z-[999] text-black font-bold">
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

      <Modal.Stack>
        <Modal
          color="dark"
          radius="md"
          size="xl"
          classNames={{
            root: "!bg-white",
            content: "!bg-white !h-[500px]",
            title: "!text-black !font-semibold !text-lg",
            header: "!bg-gray-100 !border-b !border-zinc-200",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          opened={stack.state["gallery-modal"]}
          onClose={() => {
            stack.open("warning-modal");
          }}
          closeOnClickOutside={false}
          closeOnEscape={false}
          title="Edit Images"
          centered
        >
          <ImageUpload
            setAllImages={setAllImages}
            allImages={allImages}
            company={company}
          ></ImageUpload>
        </Modal>

        <Modal
          radius="md"
          classNames={{
            root: "!bg-white",
            content: "!bg-white",
            title: "!font-bold",
            header: "!bg-gray-100 !border-b !border-zinc-200",
            close: "!bg-zinc-900 !text-white !shadow-lg !shadow-black/30",
          }}
          size="sm"
          title="Are you sure?"
          {...stack.register("warning-modal")}
          closeOnClickOutside={false}
          centered
        >
          <WarningModal
            onClose={() => {
              stack.close("warning-modal");
            }}
            onCloseAll={() => {
              stack.closeAll();
            }}
          ></WarningModal>
        </Modal>
      </Modal.Stack>
    </>
  );
}

export default ImageGalleryPicker;
