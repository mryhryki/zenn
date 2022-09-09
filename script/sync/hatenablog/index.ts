import { listAllPosts } from "../../common/post";

const main = async () => {
  const posts = await listAllPosts()
};

main()
  .then(() => {
    console.log("BUILD COMPLETED");
  })
  .catch((err) => {
    console.error("BUILD FAILED");
    console.error(err);
    process.exit(1);
  });
