ALTER TABLE "comments" ALTER COLUMN "file_type" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "media_name" varchar(100);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "thumbnail" varchar(256);