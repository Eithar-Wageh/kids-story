import { json } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// جدول المستخدمين (زي ما هو)
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// جدول القصص (نفس الاسم storiea ونفس الحقول بالظبط)
export const storyTable = pgTable("storiea", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  storyId: varchar().notNull().unique(),
  storySubject: varchar(),
  storyTypes: varchar(),
  ageGroup: varchar(),
  imageURL: varchar().default(""),
  content: json(),
  email: varchar("email").references(() => usersTable.email),
});