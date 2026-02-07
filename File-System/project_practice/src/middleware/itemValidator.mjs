import { z } from 'zod';

export const grocerySchema = z.object({
  body: z.object({
    item: z.string().min(2, "Item name too short"),
    itemQty: z.number().positive("Quantity must be positive"),
  })
});