import { NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST(req) {
  const body = await req.json();
  // console.log(body);
  const { prompt } = body;
  console.log(prompt);

  const client = new OpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
  });

  const response = await client.images.generate({
    model: "black-forest-labs/flux-schnell",
    prompt: prompt,
  });

  console.log(response);

  return NextResponse.json({ imageurl: response.data[0].url });
}
