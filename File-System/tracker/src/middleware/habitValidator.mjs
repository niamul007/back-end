import { z } from 'zod';

// Define ONLY the data you are looking for
export const taskSchema = z.object({
    task: z.string()
        .min(2, "Item is too small")
        .max(100, "It's too big to be a task")
});