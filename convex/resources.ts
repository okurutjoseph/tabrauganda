import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    resourceType: v.string(),
    resourceUrl: v.optional(v.string()),
    documentUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resourceId = await ctx.db.insert("resources", {
      name: args.name,
      description: args.description,
      resourceType: args.resourceType,
      resourceUrl: args.resourceUrl,
      documentUrl: args.documentUrl,
      thumbnailUrl: args.thumbnailUrl,
      createdAt: Date.now(),
    });
    return resourceId;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("resources").collect();
  },
}); 