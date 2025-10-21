import axios from "axios";

// NOTE: Ensure your .env file is correctly set up with VITE_FOOTBALL_KEY
const BASE_URL = "/api/v4";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // This is the CRITICAL part to verify
    "X-Auth-Token": import.meta.env.VITE_FOOTBALL_KEY,
  },
});

/**
 * TEST FUNCTION: Fetch details for a well-known player ID.
 * Use a real, known player ID (e.g., Cristiano Ronaldo's ID is often 7705)
 * to ensure the request hits a valid resource.
 */
export const testApiConnection = async (playerId: string = "7705") => {
  console.log(`Attempting to fetch details for player ID: ${playerId}`);
  console.log(
    "Using API Key (last 4 chars):",
    String(import.meta.env.VITE_FOOTBALL_KEY).slice(-4)
  );

  try {
    const response = await api.get(`/persons/${playerId}`);

    console.log("✅ Success! API Connection and Authentication Confirmed.");
    console.log("Player Name:", response.data.name);
    console.log("Position:", response.data.position);

    // Return the data for inspection
    return response.data;
  } catch (error) {
    // Detailed error logging is essential for troubleshooting
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (e.g., 403, 404, 429)
        console.error("❌ API Error Response Received:");
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);

        // Use a conditional check for specific, common errors
        if (error.response.status === 403) {
          console.error(
            "⚠️ LIKELY CAUSE: 403 Forbidden. The 'X-Auth-Token' is incorrect, expired, or missing."
          );
        } else if (error.response.status === 404) {
          console.error(
            "⚠️ LIKELY CAUSE: 404 Not Found. The player ID is invalid or the endpoint is wrong."
          );
        } else if (error.response.status === 429) {
          console.error(
            "⚠️ LIKELY CAUSE: 429 Too Many Requests. You hit the rate limit. Wait a minute and try again."
          );
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error, CORS)
        console.error("❌ Network Error: No response received from API.");
        console.error(
          "⚠️ LIKELY CAUSE: CORS policy or a broader network issue."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("❌ Axios Setup Error:", error.message);
      }
    } else {
      console.error("❌ Unknown Error:", error);
    }
    throw error;
  }
};

// You'll need to call this function from your main application file (e.g., App.tsx)
// Example usage (assuming you are in a modern JS/TS environment):
/* // In your App.tsx or a separate test file:
    import { testApiConnection } from './api';

    const runTest = async () => {
        try {
            await testApiConnection();
        } catch (e) {
            console.log("Test failed. See errors above.");
        }
    }
    runTest();
*/
