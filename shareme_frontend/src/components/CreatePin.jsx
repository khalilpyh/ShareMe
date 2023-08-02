import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import { categories } from "../utils/data";
import Spinner from "./Spinner";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const CreatePin = ({ user }) => {
  //hooks
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();

  const uploadImage = (event) => {
    const selectedFile = event.target.files[0];
    // uploading image to database if file type is correct
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Upload failed:", err.message);
        });
    } else {
      //wrong file type
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const deleteImage = () => {
    setImageAsset(null);
  };

  const handleTitleOnChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAboutOnChange = (event) => {
    setAbout(event.target.value);
  };

  const handleDestinationOnChange = (event) => {
    setDestination(event.target.value);
  };

  const handleCategoryOnChange = (event) => {
    setCategory(event.target.value);
  };

  const validatedUrl = (inputUrl) => {
    // Check if the inputUrl starts with "http://"
    if (inputUrl.startsWith("http://")) {
      // Replace "http://" with "https://"
      return inputUrl.replace("http://", "https://");
    } else if (!inputUrl.startsWith("https://")) {
      // If the inputUrl doesn't start with either "http://" or "https://",
      // we will prepend "https://" to the inputUrl.
      return `https://${inputUrl}`;
    } else {
      //simply return the original url
      return inputUrl;
    }
  };

  const savePin = () => {
    //check if all fields are entered
    if (title && about && destination && imageAsset?._id && category) {
      //validate the url
      const validatedDestination = validatedUrl(destination);

      //create the pin and add to database
      const document = {
        _type: "pin",
        title,
        about,
        destination: validatedDestination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };
      client.create(document).then(() => {
        //back to home page
        navigate("/");
      });
    } else {
      //display warning and hide it in 2 sec
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {/* display warning */}
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please add all fields.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {/* display a spinner if content is loading */}
            {loading && <Spinner />}
            {/* display message if wrong image type is attached */}
            {wrongImageType && <p>It&apos;s wrong file type.</p>}
            {/* image upload/delete section */}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB.
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded file"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={deleteImage}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* create pin form */}
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          {/* title input */}
          <input
            type="text"
            value={title}
            onChange={handleTitleOnChange}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {/* display user icon */}
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          {/* about input */}
          <input
            type="text"
            value={about}
            onChange={handleAboutOnChange}
            placeholder="What is your Pin about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* destination input */}
          <input
            type="url"
            value={destination}
            onChange={handleDestinationOnChange}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* category selection */}
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={handleCategoryOnChange}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">
                  Select Category
                </option>
                {categories.map((category) => (
                  <option
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {/* save pin button */}
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
