import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

//configure sanity client
export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-07-28",
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
});

//generate image urls
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
