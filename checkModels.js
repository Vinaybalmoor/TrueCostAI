require("dotenv").config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("\n=== TEXT MODELS YOUR API KEY SUPPORTS ===");

    data.models.forEach((model) => {
      // We only care about models that can generate text (generateContent)
      if (model.supportedGenerationMethods.includes("generateContent")) {
        // Remove the 'models/' prefix to give you the exact string you need
        const exactModelName = model.name.replace("models/", "");
        console.log(`✅ ${exactModelName}`);
      }
    });
    console.log("=========================================\n");
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
