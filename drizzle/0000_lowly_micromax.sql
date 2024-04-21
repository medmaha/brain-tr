CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"caption" text NOT NULL,
	"author_id" integer NOT NULL,
	"file_url" varchar(256),
	"hashtags" varchar(256),
	"likes_count" integer DEFAULT 0,
	"replies_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"file_type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"object_id" integer NOT NULL,
	"object_type" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer,
	"caption" text NOT NULL,
	"file_url" varchar(256) NOT NULL,
	"hashtags" varchar(256),
	"likes_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"file_type" varchar(25) NOT NULL,
	"slug" varchar(100),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"phone" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" varchar(256) DEFAULT '' NOT NULL,
	"file_url" varchar(256),
	"biography" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"slug" varchar(256),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_slug_unique" UNIQUE("slug")
);
