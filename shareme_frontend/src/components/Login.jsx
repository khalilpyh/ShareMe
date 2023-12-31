import React from "react";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  function responseGoogle(response) {
    const decode = jwt_decode(response.credential);
    localStorage.setItem("user", JSON.stringify(decode));

    const { name, sub, picture } = decode;

    //create the new user and store in database
    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true }); //redirect to home page
    });
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
        <div className="p-5">
          <img src={logo} width="130px" alt="logo" />
        </div>

        <div className="shadow-2xl">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
