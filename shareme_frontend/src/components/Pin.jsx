import React, { useState } from "react";
import { client, urlFor } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

const Pin = ({ pin }) => {
  //distruct the passed in pin obj
  const { postedBy, image, _id, destination } = pin;

  //hooks
  const navigate = useNavigate();
  const [pinHovered, setPinHovered] = useState(false);
  const [savingPin, setSavingPin] = useState(false);

  const handleMouseEnter = () => {
    setPinHovered(true);
  };

  const handleMouseLeave = () => {
    setPinHovered(false);
  };

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img
          className="rounded-lg w-full"
          alt="user pin"
          src={urlFor(image).width(250).url()}
        />
        {/* TODO: the functionality on pin hover*/}
      </div>
    </div>
  );
};

export default Pin;
