import React, { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ searchString }) => {
  //hooks
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //get all pins base on search string
    if (searchString !== "") {
      setLoading(true);
      const query = searchQuery(searchString.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      //get all pins from database
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchString]);

  return (
    <div>
      {/* display spinner with message if pins are loading */}
      {loading && <Spinner message="Searching pins" />}
      {/* display the searched pins */}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {/* display message if nothing found */}
      {pins?.length === 0 && searchString !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No Pins Found!</div>
      )}
    </div>
  );
};

export default Search;
