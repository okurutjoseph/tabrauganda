import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Services table
  services: defineTable({
    projectName: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // Impact table
  impact: defineTable({
    heading: v.string(),
    description: v.string(),
    // Allow both old and new fields temporarily
    mediaType: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).searchIndex("by_heading", {
    searchField: "heading",
  }),

  // Support table
  support: defineTable({
    category: v.string(), // 'mother' or 'child'
    name: v.string(),
    age: v.number(),
    location: v.string(),
    story: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),
}); 