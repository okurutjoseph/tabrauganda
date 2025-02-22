import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    projectName: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const serviceId = await ctx.db.insert("services", {
      projectName: args.projectName,
      description: args.description,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
    return serviceId;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
}); 