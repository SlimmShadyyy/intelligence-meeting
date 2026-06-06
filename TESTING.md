# Testing Documentation

### 1. Test Scenarios Executed
* **Authentication:** Valid/invalid logins, accessing protected routes without a token, accessing routes with an expired/malformed token.
* **Action Items (CRUD):** Creating valid items, retrieving lists, testing the `GET /overdue` endpoint specifically, and testing valid/invalid status updates (e.g., rejecting a status of "FINISHED" instead of "COMPLETED").
* **AI Analysis:** Triggering the Gemini analysis endpoint and verifying the database successfully updates with the returned nested arrays.

### 2. Edge Cases Considered
* Generating trace IDs (`x-trace-id`) even if the client forgets to send one.
* Preventing server crashes when the database is unreachable (Global Error Handling).
* Overdue cron jobs attempting to parse malformed dates.

### 3. Limitations Discovered
* True integration testing of the AI endpoint triggers real API calls to Google. To prevent rate-limiting and billing issues in automated CI/CD environments, the AI service functions must be mocked using Jest during automated test runs.