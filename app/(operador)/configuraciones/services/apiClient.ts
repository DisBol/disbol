export async function apiCall(
  endpoint: string,
  body?: Record<string, unknown>,
) {
  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint, body }),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorBody = await response.text();
      errorMessage = `${response.statusText} - ${errorBody}`;
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(`API Error: ${response.status} ${errorMessage}`);
  }

  return response.json();
}
