# Architectural Decisions

### 1. Database Choice: SQLite with Prisma ORM
* **Why it was chosen:** The assignment required a relational database. SQLite requires absolutely zero configuration, making it incredibly easy for evaluators to run locally. Prisma provides type safety and easy schema migrations.
* **Alternatives considered:** PostgreSQL via Docker.
* **Trade-offs:** SQLite lacks the high concurrency capabilities of Postgres, but for an evaluation project, portability and ease-of-use heavily outweighed enterprise scaling needs.

### 2. Authentication Strategy: JWT (JSON Web Tokens)
* **Why it was chosen:** Stateless authentication is the industry standard for REST APIs. It prevents the server from needing to store session data in memory or a database.
* **Alternatives considered:** Session-based authentication with cookies.
* **Trade-offs:** JWTs cannot be easily revoked before expiration without implementing a complex token blacklist in the database.

### 3. External Integration: Slack Webhooks
* **Why it was chosen:** Webhooks are real-time, highly visual, and demonstrate a clear understanding of outbound HTTP requests.
* **Alternatives considered:** Email integrations (SendGrid/Nodemailer).
* **Trade-offs:** Slack webhooks only send to a specific channel rather than dynamic user inboxes, but they are much faster to configure and test.

### 4. Project Structure: Controller/Service/Route
* **Why it was chosen:** Separates business logic (Services) from HTTP request handling (Controllers) and URL routing (Routes).
* **Alternatives considered:** Monolithic `server.js` file.
* **Trade-offs:** Requires slightly more boilerplate code, but is vastly superior for readability, maintainability, and testing.