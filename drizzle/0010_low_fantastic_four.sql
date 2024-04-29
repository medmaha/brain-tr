ALTER TABLE "comments" ADD COLUMN "author_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "post_slug" varchar NOT NULL;