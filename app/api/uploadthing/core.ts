import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploader
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    }
  })
    .middleware(() => {
      // This code runs on your server before upload
      return { 
        timestamp: Date.now(),
        userId: 'admin' // Add a userId for tracking
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for file:", file.name);
      console.log("File URL:", file.url);
      console.log("File key:", file.key);
      console.log("Metadata:", metadata);
      
      // Return file details to the client
      return { 
        url: file.url,
        key: file.key 
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
