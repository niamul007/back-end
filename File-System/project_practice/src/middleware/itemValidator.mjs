
import {z} from 'zod'

export const grocerySchema = z.object({
  body: z.object({
    item: z.string().min(2,"Item is too short").max(100,"it is too big to be an item"),
    itemQty: z.number().positive("Quantity must be positive")
  })
})