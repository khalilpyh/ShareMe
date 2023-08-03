import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { AiOutlineLogout } from "react-icons/ai";

//random image source
const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

//active/inactive button style
const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const inActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  //hooks
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); //Created | Saved
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    //get the user info
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    //get different pins data base on the active button clicked
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logoutUser = () => {
    //logout from google
    googleLogout();
    //logout from local
    localStorage.clear();

    navigate("/login");
  };

  const createdButtonClicked = (event) => {
    setText(event.target.textContent);
    setActiveBtn("created");
  };

  const savedButtonClicked = (event) => {
    setText(event.target.textContent);
    setActiveBtn("saved");
  };

  //display loading spinner if user does not exists
  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            {/* user banner */}
            <img
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              src={randomImage}
              alt="user banner"
            />
            {/* user profile picture */}
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {/* display logout button if user id matches */}
              {userId === user._id && (
                <button
                  onClick={logoutUser}
                  type="button"
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              )}
            </div>
          </div>
          {/* buttons to switch between */}
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={createdButtonClicked}
              className={`${
                activeBtn === "created" ? activeBtnStyles : inActiveBtnStyles //apply button active effect
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={savedButtonClicked}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : inActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {/* display pins accordinly */}
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
