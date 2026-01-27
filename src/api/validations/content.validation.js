import z from "zod";

export const ContentValidation = {
  update: z.object({
    umkm_name: z.string().nullable(),
    umkm_address: z.string().nullable(),

    hero_photo: z.string().nullable(),
    hero_headline: z.string().nullable(),
    hero_subheadline: z.string().nullable(),
    hero_description: z.string().nullable(),

    favorite_title: z.string().nullable(),
    favorite_information: z.string().nullable(),
    favorite_max_product: z.number().nullable(),

    facility_title: z.string().nullable(),
    facility_information: z.string().nullable(),

    cta_title: z.string().nullable(),
    cta_button: z.string().nullable(),
    cta_link_id: z.number().nullable(),

    testimoni_title: z.string().nullable(),
    testimoni_information: z.string().nullable(),

    location_photo: z.string().nullable(),
    location_title: z.string().nullable(),
    location_maps: z.string().nullable(),
    location_button: z.string().nullable(),
    location_link_id: z.number().nullable(),
  }),
};
