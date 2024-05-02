import { z } from "zod";

export const formDataSchema = z.object({
  prompt: z
    .string({
      required_error: "prompt is required",
      invalid_type_error: "prompt must be a string",
    })
    .min(2)
    .max(6000),
    
  // messages: z .string({
  //   required_error: "messages is required",
  //   invalid_type_error: "messages must be a string",
  // })
  //   .min(2)
  //   .max(4000),
})
