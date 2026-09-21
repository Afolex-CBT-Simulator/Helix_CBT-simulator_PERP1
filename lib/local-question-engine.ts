import {
  pipeline,
  type TextGenerationPipeline
} from "@huggingface/transformers";

let generator: TextGenerationPipeline | null = null;

const DEFAULT_PROMPT = `
Create multiple-choice questions for secondary school students.

Requirements:
- Use the subject, topic, and level provided.
- Give exactly four options for every question.
- Make only one option correct.
- Give a short, accurate explanation for the correct answer.
- If source notes are provided, use them as the main authority.
- Do not invent facts that are not supported by the source notes.
- Return valid JSON only.
`;

type GenerationInput = {
  subject: string;
  topic: string;
  level: string;
  count?: number;
  customPrompt?: string;
  sourceNote?: string;
};

export type GeneratedQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

function extractQuestions(text: string): GeneratedQuestion[] {
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("The model did not return valid question JSON.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  } catch {
    throw new Error("The model returned invalid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("The generated result is not a question list.");
  }

  return parsed.filter((item): item is GeneratedQuestion => {
    if (!item || typeof item !== "object") return false;

    const question = item as Record<string, unknown>;

    return (
      typeof question.question === "string" &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((option) => typeof option === "string") &&
      typeof question.answer === "string" &&
      typeof question.explanation === "string"
    );
  });
}

async function generateBatch(
  input: GenerationInput,
  batchCount: number
): Promise<GeneratedQuestion[]> {
  if (!generator) {
    generator = (await pipeline(
      "text-generation",
      "HuggingFaceTB/SmolLM2-360M-Instruct"
    )) as TextGenerationPipeline;
  }

  const customPrompt = input.customPrompt?.trim() || DEFAULT_PROMPT;
  const sourceNote = input.sourceNote?.trim();

  const prompt = `
${customPrompt}

Generation details:
Subject: ${input.subject}
Topic: ${input.topic}
Level: ${input.level}
Number of questions: ${batchCount}

${
  sourceNote
    ? `SOURCE NOTE:
${sourceNote}

Use the source note when writing the answer and explanation.`
    : "No source note was provided. Use reliable general subject knowledge."
}

Return only valid JSON using exactly this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option text",
    "explanation": "Short explanation"
  }
]
`;

  const result = await generator(prompt, {
    max_new_tokens: 1800,
    temperature: 0.7,
    do_sample: true,
    return_full_text: false
  });

  const generated = Array.isArray(result) ? result[0] : result;

  const text =
    typeof generated === "object" &&
    generated !== null &&
    "generated_text" in generated
      ? String(generated.generated_text)
      : String(generated);

  return extractQuestions(text);
}

export async function generateQuestions(
  input: GenerationInput
): Promise<GeneratedQuestion[]> {
  const requestedCount = Math.min(Math.max(input.count ?? 5, 1), 100);
  const batchSize = 5;
  const allQuestions: GeneratedQuestion[] = [];

  while (allQuestions.length < requestedCount) {
    const remaining = requestedCount - allQuestions.length;
    const currentBatchSize = Math.min(batchSize, remaining);

    const batch = await generateBatch(input, currentBatchSize);
    allQuestions.push(...batch);

    if (batch.length === 0) {
      throw new Error(
        "The model could not generate a valid batch. Please try again."
      );
    }
  }

  return allQuestions.slice(0, requestedCount);
}
