CREATE TABLE IF NOT EXISTS "users_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"follower_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "viber" (
	"id" serial PRIMARY KEY NOT NULL,
	"genres" text NOT NULL,
	"user_id" integer NOT NULL,
	"youtube" varchar(256),
	"facebook" varchar(256),
	"instagram" varchar(256),
	"category" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_type" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "followers_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "following_count" integer DEFAULT 0 NOT NULL;