import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    heading: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { heading, description, imageUrl } = args;
    
    // Create new document with new fields only
    const impactId = await ctx.db.insert("impact", {
      heading,
      description,
      imageUrl,
      createdAt: Date.now(),
    });
    return impactId;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const stories = await ctx.db.query("impact").collect();
    // Transform the results to use imageUrl consistently
    return stories.map(story => {
      if (!story) return null;
      
      const transformed = { ...story };
      // Ensure required fields have default values if missing
      transformed.heading = transformed.heading || "Untitled Story";
      transformed.description = transformed.description || "";
      transformed.createdAt = transformed.createdAt || Date.now();
      
      // If we have mediaUrl but no imageUrl, use mediaUrl
      if (!transformed.imageUrl && transformed.mediaUrl) {
        transformed.imageUrl = transformed.mediaUrl;
      }
      
      return transformed;
    }).filter(Boolean); // Remove any null values
  },
});

export const update = mutation({
  args: {
    id: v.id("impact"),
    heading: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, heading, description, imageUrl } = args;
    await ctx.db.patch(id, {
      heading,
      description,
      imageUrl,
    });
    return id;
  },
});

// Migration mutation to update old records
export const migrateOldRecords = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all impact stories
    const stories = await ctx.db.query("impact").collect();
    
    // Update each story to the new schema
    for (const story of stories) {
      if (!story) continue;
      
      // Ensure we have all required fields with defaults if missing
      const heading = story.heading || "Untitled Story";
      const description = story.description || "";
      const createdAt = story.createdAt || Date.now();
      
      // @ts-ignore - Accessing old fields that are not in the current schema
      const mediaUrl = story.mediaUrl;
      
      try {
        // Replace the old document with a new one using the new schema
        await ctx.db.replace(story._id, {
          heading,
          description,
          imageUrl: mediaUrl || undefined,
          createdAt
        });
      } catch (error) {
        console.error(`Failed to migrate story ${story._id}:`, error);
      }
    }
    
    return "Migration completed";
  },
}); 