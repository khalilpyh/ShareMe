import React, { useState } from "react";
import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4, v4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

const Pin = ({ pin }) => {
  //hooks
  const navigate = useNavigate();
  const [pinHovered, setPinHovered] = useState(false);
  const [savingPin, setSavingPin] = useState(false);

  //destructuring pin object been passed in
  const { postedBy, image, _id, destination, save } = pin;

  //get the user
  const user = fetchUser();

  //check if current user already saved the pin
  const userAlreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.sub
  )?.length;

  const savePin = (id) => {
    if (!userAlreadySaved) {
      setSavingPin(true);

      //save the pin for the user with specific user id
      client
        .patch(id)
        .setIfMissing({ save: [] }) //inital save array to be empty
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPin(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  const handleMouseEnter = () => {
    setPinHovered(true);
  };

  const handleMouseLeave = () => {
    setPinHovered(false);
  };

  const handleImageDownload = (event) => {
    // prevents further propagation of the download button click
    event.stopPropagation();
  };

  const handleImageSave = (event) => {
    // prevents further propagation of the download button click
    event.stopPropagation();
    //save pin for the current user
    savePin(_id);
  };

  const handleImageDelete = (event) => {
    // prevents further propagation of the download button click
    event.stopPropagation();
    //save pin for the current user
    deletePin(_id);
  };

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        {/* show image if exists */}
        {image && (
          <img
            className="rounded-lg w-full"
            alt="user pin"
            src={urlFor(image).width(250).url()}
          />
        )}

        {/* show buttons if hovering over image */}
        {pinHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              {/* download image button */}
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={handleImageDownload}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {/* save image button */}
              {userAlreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={handleImageSave}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} {savingPin ? "Saving" : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {/* button for navigate to the third party url */}
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination?.slice(8, 20) + "..."
                    : destination.slice(8)}
                </a>
              )}

              {/* delete pin button */}
              {postedBy?._id === user?.sub && (
                <button
                  type="button"
                  onClick={handleImageDelete}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Author info button */}
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
