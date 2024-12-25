import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CompanyProfileImages } from "@/types/api.types";
import Image from "next/image";

function ImageGallery({ images }: { images?: CompanyProfileImages[] }) {
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4500,
    autoplaySpeed: 0,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 100,
          autoplay: false,
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {images?.map((image) => (
        <div
          key={image.id}
          className="shadow-lg h-72 w-full relative rounded-xl"
        >
          <Image
            className="object-cover rounded-xl"
            src={image.image}
            alt="Image Gallery"
            fill
          />
        </div>
      ))}
    </Slider>
  );
}

export default ImageGallery;
