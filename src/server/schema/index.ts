import { posts, postsRelations } from "./posts";
import { users } from "./users";
import { likes, comments, commentsRelations } from "./comment_and_likes";

const relations = {
  postsRelations,
  commentsRelations,
};

const schema = { users, posts, comments, likes, ...relations };

export default schema;
