import {
    boolean,
    integer,
    pgSchema,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const schema = pgSchema("alumnet");

export const users = schema.table("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull().unique(),
    passwordHash: text("password_hash").notNull(), // update when a password reset request is defeated
    name: text().notNull().unique(),
    bio: text(),
    contact: text(),
});

export const sessions = schema.table("sessions", {
    token: text().notNull().primaryKey(), // generated using CSPRNG

    userId: integer("user_id")
        .notNull()
        .references(() => users.id),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 week'`),

    invalidated: boolean().notNull().default(false),
});

export const follows = schema.table("follows", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    followerId: integer()
        .notNull()
        .references(() => users.id),
    followingId: integer()
        .notNull()
        .references(() => users.id),
    createdAt: timestamp().notNull().defaultNow(),
});

export const media = schema.table("media", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    resourceUrl: text().notNull(),
});

export const postType = schema.enum("postType", [
    "opportunity",
    "post",
    "event",
]);

export const posts = schema.table("posts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
        .notNull()
        .references(() => users.id),
    body: text().notNull(),
    image: integer()
        .notNull()
        .references(() => media.id),
    type: postType().notNull(),
});
