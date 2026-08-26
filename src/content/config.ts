import { z, defineCollection } from 'astro:content';

const handbook = defineCollection({
  schema: z.object({
    title: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  handbook,
};
