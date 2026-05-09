import { z } from "zod";

const currentYear = new Date().getFullYear();

export const VinylSchema = z.object({
  artist: z.string().min(1, "Artist is required").max(200),
  album: z.string().min(1, "Album name is required").max(200),
  year: z
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(currentYear, `Year cannot exceed ${currentYear}`),
});

export type VinylInput = z.infer<typeof VinylSchema>;
