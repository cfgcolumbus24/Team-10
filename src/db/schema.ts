import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull().unique(),
    passwordHash: text("password_hash").notNull(), // update when a password reset request is defeated
    name: text().notNull().unique(),
    bio: text().notNull(),
    contact: text().notNull(),
});

export const sessions = pgTable("sessions", {
    token: text().notNull().primaryKey(), // generated using CSPRNG

    userId: integer("user_id")
        .notNull()
        .references(() => users.id),

    ipAddr: text("ip_addr"),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 week'`),

    invalidated: boolean().notNull().default(false),
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
