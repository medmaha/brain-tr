import { posts, postsRelations } from "./posts";
import { users } from "./users";
import { followers, followerRelations } from "./followers";
import { viber, viberRelations } from "./viber";
import { likes, comments, commentsRelations } from "./comment_and_likes";

const relations = {
  viberRelations,
  postsRelations,
  commentsRelations,
  followerRelations,
};

const schema = {
  users,
  posts,
  comments,
  viber,
  likes,
  followers,
  ...relations,
};

export default schema;
