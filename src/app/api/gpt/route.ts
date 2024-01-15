/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export async function POST(req: Request) {
  try {
    const {prompt} = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    return Response.json({data});
  } catch (error) {
    return Response.json({error});
  }
}
