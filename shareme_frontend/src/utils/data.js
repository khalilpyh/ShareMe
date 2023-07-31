export const userQuery = (userId) => {
  // find the user by id
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

export const searchQuery = (searchString) => {
  //find the content with title, about or category matches the search string
  const query = `*[_type == "pin" && title match '${searchString}*' || category match '${searchString}*' || about match '${searchString}*' ]{
      image {
        asset -> {
          url
        }
      },
      _id,
      destination,
      postedBy -> {
        _id,
        userName,
        image
      },
      save[] {
        _key,
        postedBy ->{
          _id,
          userName,
          image
        },
      }
  }`;

  return query;
};

//find all the content and order by the latest
export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
  image {
    asset -> {
      url
    }
  },
  _id,
  destination,
  postedBy -> {
    _id,
    userName,
    image
  },
  save[] {
    _key,
    postedBy ->{
      _id,
      userName,
      image
    },
  }
}`;
