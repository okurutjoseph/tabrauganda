import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    heading: v.string(),
    description: v.string(),
    mediaType: v.string(),
    mediaUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const impactId = await ctx.db.insert("impact", {
      heading: args.heading,
      description: args.description,
      mediaType: args.mediaType,
      mediaUrl: args.mediaUrl,
      createdAt: Date.now(),
    });
    return impactId;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("impact").collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("impact"),
    heading: v.string(),
    description: v.string(),
    mediaType: v.string(),
    mediaUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, heading, description, mediaType, mediaUrl } = args;
    await ctx.db.patch(id, {
      heading,
      description,
      mediaType,
      mediaUrl,
    });
    return id;
  },
}); 