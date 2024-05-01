import { posts, postsRelations } from "./posts";
import { users } from "./users";
import { followers, followerRelations } from "./followers";
import { viber, viberRelations } from "./viber";
import { supporter, supporterRelations } from "./supporter";
import { likes, comments, commentsRelations } from "./comment_and_likes";

const relations = {
  viberRelations,
  postsRelations,
  commentsRelations,
  followerRelations,
  supporterRelations,
};

const schema = {
  users,
  posts,
  comments,
  viber,
  supporter,
  likes,
  followers,
  ...relations,
};

export default schema;
