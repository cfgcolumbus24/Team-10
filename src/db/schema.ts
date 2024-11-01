import {
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    name: text().notNull().unique(),
    bio: text().notNull(),
    contact: text().notNull(),
});

export const follows = pgTable("follows", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    followerId: integer()
        .notNull()
        .references(() => users.id),
    followingId: integer()
        .notNull()
        .references(() => users.id),
    createdAt: timestamp().notNull().defaultNow(),
});

export const media = pgTable("media", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    resourceUrl: text().notNull(),
});

export const postType = pgEnum("postType", ["opportunity", "post", "event"]);

export const posts = pgTable("posts", {
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
