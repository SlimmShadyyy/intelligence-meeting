# AI Grounding & Implementation Strategy

### 1. Prompt Design
The system prompt was engineered with strict, authoritative instructions. It explicitly defines the format and aggressively restricts the LLM from utilizing outside knowledge, forcing it to act solely as a parser of the provided text.

### 2. Citation Strategy
The prompt requires the LLM to map every generated insight (summary, action item, decision) to an exact `timestamp` from the transcript. This creates a direct, auditable link between the AI output and the source data.

### 3. Hallucination Prevention Approach
* **Zero Temperature:** The Gemini API is configured with `temperature: 0.0`. This mathematically forces the model to choose the most probable tokens, entirely disabling its "creative" generation capabilities.
* **Strict JSON Schema:** The API request utilizes `responseMimeType: "application/json"`. By forcing the model to adhere to a rigid JSON structure where the `citations` array is mandatory, the model cannot successfully generate a claim without also parsing a timestamp to back it up.

### 4. Output Validation Strategy
The JSON response from Gemini is parsed and immediately fed into Prisma ORM. Prisma acts as the final validation layer, ensuring data types (strings, arrays, dates) strictly match the database schema before persistence.

### 5. Known Limitations
* Context Window limits: Exceedingly long transcripts (multi-hour meetings) might exceed token limits or cause the model to lose track of details in the middle of the text.
* Timestamp Dependency: The model's citation accuracy is entirely dependent on the quality of the formatting of the transcript array passed to it.