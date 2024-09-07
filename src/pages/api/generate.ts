import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

type FinaleAlternativo = {
  title: string;
  content: string;
};

const extractFinals = (story: string): { title: string; content: string }[] => {
  // Trova la sezione dei finali alternativi
  const finalsSectionMatch = story.match(
    /\*\*Finali Alternativi\*\*\s*([\s\S]*)/m
  );

  if (!finalsSectionMatch) {
    return [];
  }

  const finalsSection = finalsSectionMatch[1].trim();

  // Funzione per rimuovere asterischi
  const removeAsterisks = (text: string): string => {
    return text.replace(/\*+/g, ""); // Rimuove tutte le occorrenze degli asterischi
  };

  // Estrai i finali alternativi
  const finals = finalsSection
    .split(/(?=\n\d+\.\s)/) // Usa un'espressione regolare per dividere in base ai numeri dei finali
    .filter((part) => part.trim()) // Rimuovi parti vuote
    .map((part) => {
      // Trova il titolo e il contenuto
      const [titleLine, ...contentLines] = part.trim().split("\n");
      const titleMatch = titleLine.match(/^\d+\.\s*(.*)$/);
      const title = titleMatch
        ? removeAsterisks(titleMatch[1].trim())
        : "Finale";
      const content = contentLines.join("\n").trim(); // Unisci le linee di contenuto

      return {
        title,
        content,
      };
    });

  return finals;
};

// Utilizzo della funzione nella route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Invalid prompt" });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "API key is missing." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const output = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return res.status(500).json({ message: "No output generated" });
    }

    const finals = extractFinals(output);
    const storyWithoutFinals = output.split("**Finali Alternativi**")[0].trim();

    res.status(200).json({ story: storyWithoutFinals, finals });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Error generating content" });
  }
}
