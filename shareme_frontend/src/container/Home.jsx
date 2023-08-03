import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar, UserProfile } from "../components";
import { client } from "../client";
import logo from "../assets/logo.png";
import Pins from "./Pins";
import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  //hooks
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  //get the user
  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => setUser(data[0]));
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  const handleHiMenuOnClick = () => {
    setToggleSidebar(true);
  };

  const handleCloseCircleOnClick = () => {
    setToggleSidebar(false);
  };

  //redirect to login page if not signed in
  if (!user) {
    navigate("/login");
  }

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user ?? user} />
      </div>
      {console.log(user)}

      {/* Mobile sidebar */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          {/* Hamburger menu icon */}
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={handleHiMenuOnClick}
          />
          {/* App logo */}
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          {/* User profile icon*/}
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="user profile" className="w-14" />
          </Link>
        </div>
        {/* Show and hide sidebar on mobile devices */}
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer "
                onClick={handleCloseCircleOnClick}
              />
            </div>
            <Sidebar user={user ?? user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      {/* Content section scrollable */}
      <div className="pb-2 flex-1 h-screem overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
