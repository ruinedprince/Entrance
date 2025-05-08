// Centralized API utility for handling fetch requests

const BASE_URL = "http://localhost:5000";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { method = "GET", headers = {}, body } = options;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}