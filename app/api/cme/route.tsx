export async function GET(request: Request) {
  const apiKey = process.env.NASA_API_KEY;
  try {
    const response = await fetch(
      `https://api.nasa.gov/DONKI/CME?api_key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    const remaining = response.headers.get("x-ratelimit-remaining"); // TESTING ONLY
    console.log(remaining); // TESTING ONLY

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `API request failed with status ${response.status}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
