import * as z from "zod";

export const EventformSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 2 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 2 characters.",
  }),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});
