import React, { useState } from "react";
import { Sparkles, ShieldCheck, Send } from "lucide-react";
import { generateAIResponse, saveLogToFirestore } from "./lib/googleServices";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRun(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const reply = await generateAIResponse(prompt);
      setOutput(reply);
      await saveLogToFirestore("interactions", { prompt, reply }).catch(() => {});
    } catch (err) {
      setError(err.message || "Failed to generate response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui, sans-serif", padding: "0 1rem" }}>
      <header role="banner" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Sparkles aria-hidden="true" />
        <h1>PromptWars AI Workspace</h1>
      </header>

      <main role="main">
        <form onSubmit={handleRun} aria-label="AI Prompt Submission Form">
          <label htmlFor="prompt-input" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
            Enter your query or task
          </label>
          <textarea
            id="prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the problem or input..."
            aria-required="true"
            style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            aria-label="Submit prompt to Gemini AI"
            style={{
              marginTop: "0.75rem",
              padding: "0.6rem 1.25rem",
              borderRadius: 8,
              border: "none",
              background: "#0f172a",
              color: "#fff",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Send size={16} aria-hidden="true" />
            {loading ? "Processing..." : "Run Gemini AI"}
          </button>
        </form>

        {error && (
          <p role="alert" style={{ color: "#dc2626", marginTop: "1rem" }}>
            {error}
          </p>
        )}

        {output && (
          <section aria-live="polite" aria-label="AI Generated Output" style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: 8 }}>
            <h2>Response</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{output}</p>
          </section>
        )}
      </main>

      <footer role="contentinfo" style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <ShieldCheck size={16} aria-hidden="true" />
        <span>Powered by Google Gemini 1.5 Flash & Firebase</span>
      </footer>
    </div>
  );
}
