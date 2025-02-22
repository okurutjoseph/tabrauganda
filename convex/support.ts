import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    category: v.string(),
    name: v.string(),
    age: v.number(),
    location: v.string(),
    story: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const supportId = await ctx.db.insert("support", {
      category: args.category,
      name: args.name,
      age: args.age,
      location: args.location,
      story: args.story,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
    return supportId;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("support").collect();
  },
}); 