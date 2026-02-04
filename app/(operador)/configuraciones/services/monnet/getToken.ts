export interface MonnetTokenResponse {
  status: number;
  data: string;
}

export async function getMonnetToken(): Promise<string> {
  const apiKey = process.env.MONNET_API_KEY;
  const username = process.env.MONNET_USERNAME;
  const password = process.env.MONNET_PASSWORD;
  const baseUrl = process.env.NEXT_MONNET_API;

  if (!apiKey || !username || !password || !baseUrl) {
    throw new Error("Monnet API credentials not configured");
  }

  const url = `${baseUrl}/gettoken?apikey=${apiKey}&token=&username=${username}&password=${password}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Monnet token: ${response.statusText}`);
  }

  const result: MonnetTokenResponse = await response.json();

  if (result.status !== 200) {
    throw new Error(`Monnet API error: Status ${result.status}`);
  }

  return result.data;
}
