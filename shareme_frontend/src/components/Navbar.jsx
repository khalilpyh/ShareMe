import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchString, setSearchString, user }) => {
  const navigate = useNavigate();

  // Only show navbar if user exists
  if (!user) return null;

  const handleSearchOnChange = (event) => {
    return setSearchString(event.target.value);
  };

  const handleSearchOnFocus = () => {
    //direct to search page
    navigate("/search");
  };

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={handleSearchOnChange}
          placeholder="Search"
          value={searchString}
          onFocus={handleSearchOnFocus}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img src={user.image} alt="user" className="w-12 h-13 rounded-lg" />
        </Link>
        <Link
          to="/create-pin"
          className="bg-black text-white rounded-lg w-12 h-13 flex justify-center items-center"
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
