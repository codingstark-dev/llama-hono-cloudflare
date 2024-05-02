import { Hono } from "hono";
import { limiter } from "./limiter";
import { streamText } from "hono/streaming";
import { Ai } from "@cloudflare/ai";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { Bindings } from "./types/bindings";
import { formDataSchema } from "./schema/form";

const app = new Hono<{ Bindings: Bindings }>();
app.use("*", prettyJSON(), cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/chat/", async (c) => {
  const ai = new Ai(c.env.AI)
  // let { prompt } = await c.req.json();
   const formData = Object.fromEntries(await c.req.formData());
   const parsedData = formDataSchema.safeParse(formData);
  


  if (!parsedData.success) {
    return c.json({
      error: parsedData.error.format(),
    });
  }

    // return streamText(c, async (stream) => {
    //   const AIResponse = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
    //     prompt: parsedData.data.prompt,
    //     stream: true,
    //   }) as string;
    //   for await (const chunk of  AIResponse) {
    //     stream.write(chunk);
    //   }

    // });
    const AIResponse = (await ai.run("@cf/meta/llama-2-7b-chat-fp16", {
      prompt: parsedData.data.prompt as string,
      // messages: [
      //   {
      //     role: "system",
      //     content: "You are a nutrtion and health expert give adive on this json ingradients"
      //   },
      // ]
      
      stream: false,
    })) as string;

    return c.json({ status: "ok", AIResponse }, 200);
});
app.onError((e, c) => {
  console.error(e);
  return c.json(
    {
      status: "error",
      error: e.message,
    },
    500
  );
});
export default app;
