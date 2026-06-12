const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Get AI assistance for a note (explain code, suggest tags, enhance content)
// @route   POST /api/ai/assist
// @access  Private
router.post("/assist", async (req, res) => {
  try {
    const { action, title, content } = req.body;

    if (!action) {
      return res.status(400).json({ message: "Action is required" });
    }

    if (!content && !title) {
      return res.status(400).json({ message: "Content or Title is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response for fallback when GEMINI_API_KEY is not defined
      console.warn(
        "GEMINI_API_KEY is missing. Returning simulated AI response.",
      );
      return res.json(getMockResponse(action, title, content));
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";
    if (action === "suggest_tag") {
      prompt = `Suggest 1 tag from [JavaScript,TypeScript,CSS,HTML,Python,General,DevOps,Database] for title: "${title || ''}" content: "${content || ''}". Output ONLY the tag name, no punctuation.`;
    } else if (action === "enhance") {
      prompt = `Enhance and format this code/text. Add comments if code. Output ONLY optimized code/text. No markdown wrap, no explanations. Title: "${title || ''}" Content: ${content || ''}`;
    } else if (action === "explain") {
      prompt = `Explain this snippet in max 3 short bullets. Output ONLY bullet points. Title: "${title || ''}" Content: ${content || ''}`;
    } else {
      return res.status(400).json({ message: "Invalid action specified" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    if (action === "suggest_tag") {
      // Clean tag response
      const validTags = [
        "JavaScript",
        "TypeScript",
        "CSS",
        "HTML",
        "Python",
        "General",
        "DevOps",
        "Database",
      ];
      const matchedTag =
        validTags.find((t) => text.toLowerCase().includes(t.toLowerCase())) ||
        "General";
      return res.json({ text: matchedTag, suggestedTag: matchedTag });
    }

    return res.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res
      .status(500)
      .json({ message: "Error processing request with Gemini AI" });
  }
});

// Helper for Mock Responses when API key is missing
function getMockResponse(action, title, content) {
  const noteContent = content || "";
  const noteTitle = title || "";

  if (action === "suggest_tag") {
    const combined = (noteTitle + " " + noteContent).toLowerCase();
    let tag = "General";
    if (
      combined.includes("javascript") ||
      combined.includes("js") ||
      combined.includes("react") ||
      combined.includes("const ")
    ) {
      tag = "JavaScript";
    } else if (
      combined.includes("typescript") ||
      combined.includes("ts") ||
      combined.includes("interface ")
    ) {
      tag = "TypeScript";
    } else if (
      combined.includes("css") ||
      combined.includes("flexbox") ||
      combined.includes("grid") ||
      combined.includes("color:")
    ) {
      tag = "CSS";
    } else if (
      combined.includes("html") ||
      combined.includes("<div") ||
      combined.includes("href=")
    ) {
      tag = "HTML";
    } else if (
      combined.includes("python") ||
      combined.includes("def ") ||
      combined.includes("import ")
    ) {
      tag = "Python";
    } else if (
      combined.includes("sql") ||
      combined.includes("mongo") ||
      combined.includes("database") ||
      combined.includes("query")
    ) {
      tag = "Database";
    } else if (
      combined.includes("docker") ||
      combined.includes("aws") ||
      combined.includes("deploy") ||
      combined.includes("ci/cd")
    ) {
      tag = "DevOps";
    }
    return {
      text: tag,
      suggestedTag: tag,
      isSimulated: true,
      info: "Simulated AI response because GEMINI_API_KEY environment variable is not set.",
    };
  }

  if (action === "enhance") {
    return {
      text: `${noteContent}\n\n// --- Enhanced by AI Helper (Simulated) ---\n// Tip: Double check variables and add boundary error handling.\n// Enable actual Gemini AI by adding GEMINI_API_KEY in backend/.env`,
      isSimulated: true,
    };
  }

  if (action === "explain") {
    return {
      text: `* **Context**: This note is titled "${noteTitle || "Untitled"}".\n* **Structure**: Contains developer snippets or guidelines.\n* **Note**: Set up your \`GEMINI_API_KEY\` in your backend \`.env\` file to unlock real AI explanations!`,
      isSimulated: true,
    };
  }

  return { text: "Simulated response" };
}

module.exports = router;
