import * as z from 'zod';

export const reviewSchema = z.object({
    author_name: z.string(),
    author_url: z.string().nullable(),
    profile_photo_url: z.string(),
    rating: z.number().nullable(),
    description: z.string()
});

export const locationSchema = z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    description: z.string().nullable(),
    address: z.string().nullable(),
    latlng: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
    icon: z.string().nullable(),
    photos: z.string().array().nullable(),
    reviews: reviewSchema.array().nullable(),
    rating: z.number().nullable(),
    avg_price: z.number().nullable(),
    types: z.string().array().nullable(),
    website: z.string().nullable(),
    phone: z.string().nullable(),
    opening_times: z.string().array().nullable(),
});