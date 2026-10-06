import "server-only";

const API_URL = "https://api.vercel.com";

export async function vercelFetch(
    path: string,
    params: Record<string, string> = {},
) {

    // Read token from process.env.VERCEL.TOKEN
    const token = process.env.VERCEL_TOKEN;

    // If does not exist, throw an error
    if (!token) {
        throw new Error("Vercel Token not found in process.env")
    }

    // Build the url with the path and API_URL
    const url = new URL(`${API_URL}${path}`);

    // And add each param with 'url.searchParams.set(key, value)'
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    // Call fetch
    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 300 },
    });

    // If response.ok is false throw an error including response.status
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Vercel API request failed with status ${response.status}: ${body}`);
    }


    return response.json();
}