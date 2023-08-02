import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { MdDownloadForOffline } from "react-icons/md";

const PinDetail = ({ user }) => {
  // TODO: work on pin detail page
  //hooks
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams(); //retrieve pin id from url

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    //get the pin detail from database
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const queryMorePins = pinDetailMorePinQuery(data[0]);
          client.fetch(queryMorePins).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const handleCommentOnChange = (event) => {
    setComment(event.target.value);
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      //add comment to the pin to database
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setAddingComment(false);
          //clear comment textbox
          setComment("");
        });
    }
  };

  if (!pinDetail) {
    //if no detail, display spinner with message
    return <Spinner message="Loading pin..." />;
  }

  return (
    <div>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        {/* display image */}
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            className="rounded-t-3xl rounded-b-lg"
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            alt="user pin"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            {/* download image button */}
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            {/* destination url */}
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination?.slice(8)}
            </a>
          </div>
          {/* pin title and about */}
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          {/* user profile */}
          <Link
            to={`/user-profile/${pinDetail.postedBy._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg "
          >
            <img
              src={pinDetail.postedBy.image}
              className="w-10 h-10 rounded-full"
              alt="user-profile"
            />
            <p className="font-bold">{pinDetail.postedBy.userName}</p>
          </Link>
          {/* comments section */}
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail.comments?.map((item) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={item.comment}
              >
                <img
                  src={item.postedBy?.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user profile"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{item.postedBy?.userName}</p>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
          {/* make comments section */}
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${user._id}`}>
              <img
                src={user.image}
                className="w-10 h-10 rounded-full cursor-pointer"
                alt="user profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={handleCommentOnChange}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {/* display recommend pins */}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </div>
  );
};

export default PinDetail;
