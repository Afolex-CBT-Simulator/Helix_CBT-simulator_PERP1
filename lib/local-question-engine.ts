import { pipeline, type TextGenerationPipeline } from "@huggingface/transformers";

let generator: TextGenerationPipeline | null = null;

export async function generateQuestions(input: {
  subject: string;
  topic: string;
  level: string;
  count?: number;
}) {
  if (!generator) {
    generator = (await pipeline(
      "text-generation",
      "HuggingFaceTB/SmolLM2-360M-Instruct"
    )) as TextGenerationPipeline;
  }

  const count = input.count ?? 5;

  const prompt = `
Create ${count} multiple-choice questions for Nigerian secondary school students.

Subject: ${input.subject}
Topic: ${input.topic}
Level: ${input.level}

Return only valid JSON in this format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option text",
    "explanation": "Short explanation"
  }
]

Rules:
- Use exactly four options.
- Make only one option correct.
- Do not use markdown.
- Do not include commentary outside the JSON.
`;

  const result = await generator(prompt, {
    max_new_tokens: 900,
    temperature: 0.7,
    do_sample: true
  });

  const generated = Array.isArray(result) ? result[0] : result;
  const text =
    typeof generated === "object" &&
    generated !== null &&
    "generated_text" in generated
      ? String(generated.generated_text)
      : String(generated);

  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("The model did not return valid question JSON.");
  }

  return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
}
