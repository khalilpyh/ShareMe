import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
  //hooks
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams(); //get the category id from url
  const [pins, setPins] = useState(null);

  useEffect(() => {
    //display spinner
    setLoading(true);

    if (categoryId) {
      //display content within a specific category
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      //display all content
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  // when content is loading display spinner with message
  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;

  //display all content in masonry layout
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
