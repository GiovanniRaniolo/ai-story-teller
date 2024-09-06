import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

type FinaleAlternativo = {
  title: string;
  content: string;
};

const extractFinals = (story: string): { title: string; content: string }[] => {
  // Trova la sezione dei finali
  const finalsSectionMatch = story.match(
    /\*\*Finali Alternativi\*\*\s*([\s\S]*?)(?=\n\s*\d+\.\s|\s*$)/m
  );
  if (!finalsSectionMatch) {
    return [];
  }

  const finalsSection = finalsSectionMatch[1].trim();

  // Estrai i finali alternativi
  const finals = finalsSection
    .split(/\n(?=\d+\.\s)/g) // Usa un'espressione regolare per dividere in base ai numeri e ai punti
    .filter((part) => part.trim()) // Rimuovi parti vuote
    .map((part) => {
      const [titleLine, ...contentLines] = part.trim().split("\n");
      const titleMatch = titleLine.match(/^\d+\.\s*(.*)$/);
      const title = titleMatch ? titleMatch[1].trim() : "Finale";
      const content = contentLines.join("\n").trim(); // Il resto è il contenuto

      return {
        title,
        content,
      };
    });

  return finals;
};

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
    const storyWithoutFinals = output.split("## Finali Alternativi")[0];

    res.status(200).json({ story: storyWithoutFinals, finals });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Error generating content" });
  }
}
