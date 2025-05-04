// app/api/generate-article/route.ts
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON from Rekognition
    const data = JSON.parse(await request.json());
    // Assume the Rekognition JSON contains a "Labels" property that is an array of label objects.
    const labels = data.Labels;

    if (!labels || !Array.isArray(labels) || labels.length === 0) {
      return Response.json(
        { error: "No labels found in the provided Rekognition data." },
        { status: 400 }
      );
    }

    // Construct a prompt for OpenAI based on the labels
    // We create a string like "The image contains X, Y, Z."
    const labelDescriptions = labels
      .map((label: { Name: string; Confidence: number }) => {
        return `${label.Name} (confidence: ${label.Confidence.toFixed(2)}%)`;
      })
      .join(", ");

    const prompt = `Here are some labels extracted from an image: ${labelDescriptions}.
    Based on these labels, write a detailed, engaging news article that explains a current event or plausible news scenario inspired by this content. The article should be factual, well-structured, and creative.

    Please don't mention anything related to labels or confidence as these are simply ways of describing the image which was used earlier.`;

    // Ensure the OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error("OpenAI API key is not configured");
      return Response.json(
        { error: "Internal configuration error." },
        { status: 500 }
      );
    }

    // Call the OpenAI Chat Completion API
    // Using GPT-3.5-turbo here for conversational style completions.
    const openaiResponse = await fetch(
      "https://is215-openai.upou.io/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a creative news writer." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("Error from OpenAI API:", errorText);
      return Response.json(
        { error: "Failed to retrieve article from OpenAI." },
        { status: 500 }
      );
    }

    const openaiData = await openaiResponse.json();
    const article = openaiData.choices?.[0]?.message?.content;

    if (!article) {
      return Response.json(
        { error: "No article was generated." },
        { status: 500 }
      );
    }

    // Return the generated article as JSON
    return Response.json({ article });
  } catch (error: any) {
    console.error("Error in generate-article route:", error);
    return Response.json(
      { error: error.message || "Unknown error occurred." },
      { status: 500 }
    );
  }
}
