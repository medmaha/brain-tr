ALTER TABLE "comments" ALTER COLUMN "author_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "post_slug" varchar NOT NULL;