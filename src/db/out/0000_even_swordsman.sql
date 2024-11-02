CREATE SCHEMA "alumnet";
--> statement-breakpoint
CREATE TYPE "alumnet"."postType" AS ENUM('opportunity', 'post', 'event', 'admin');--> statement-breakpoint
CREATE TYPE "alumnet"."userType" AS ENUM('regular', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alumnet"."follows" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "alumnet"."follows_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"followerId" integer NOT NULL,
	"followingId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alumnet"."media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "alumnet"."media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"resourceUrl" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alumnet"."posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "alumnet"."posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"body" text NOT NULL,
	"image" integer NOT NULL,
	"type" "alumnet"."postType" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alumnet"."sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 week' NOT NULL,
	"invalidated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alumnet"."users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "alumnet"."users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"pic" integer,
	"contact" text,
	"userType" "alumnet"."userType" DEFAULT 'regular',
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alumnet"."follows" ADD CONSTRAINT "follows_followerId_users_id_fk" FOREIGN KEY ("followerId") REFERENCES "alumnet"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alumnet"."follows" ADD CONSTRAINT "follows_followingId_users_id_fk" FOREIGN KEY ("followingId") REFERENCES "alumnet"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alumnet"."posts" ADD CONSTRAINT "posts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "alumnet"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alumnet"."posts" ADD CONSTRAINT "posts_image_media_id_fk" FOREIGN KEY ("image") REFERENCES "alumnet"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alumnet"."sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "alumnet"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alumnet"."users" ADD CONSTRAINT "users_pic_media_id_fk" FOREIGN KEY ("pic") REFERENCES "alumnet"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
