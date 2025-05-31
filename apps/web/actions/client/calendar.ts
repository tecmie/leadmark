'use client';

const CLIENT_ID =
  "125541401824-ujuca4ebs55i969gvntq3te5f4rdb8pg.apps.googleusercontent.com";
const API_KEY = "AIzaSyDAKTAI1bM1FPty8627W7k25Zj-LG0sE-o";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// gapi.load('client', initializeGapiClient);


// async function initializeGapiClient() {
//   await gapi.client.init({
//     apiKey: API_KEY,
//     discoveryDocs: [DISCOVERY_DOC],
//   });
// }

// export async function connectCalendar() {
//   try {
//     const tokenClient = google.accounts.oauth2.initTokenClient({
//       client_id: CLIENT_ID,
//       scope: SCOPES,
//       callback: "https://webhook.site/905130cf-f7ba-459c-9fca-0fc7d31a12a2", // defined later
//     });
//     const resp = await tokenClient.requestAccessToken({
//       prompt: gapi.client.getToken() === null ? "consent" : "",
//     });

//     if (resp.error !== undefined) {
//       throw resp;
//     }

//     console.log("Access token:", resp);
//     await listUpcomingEvents();
//   } catch (error) {
//     console.error("Error connecting to calendar:", error);
//     throw error;
//   }
// }


