'use server';
/**
 * @fileOverview A Genkit flow for analyzing medical documents.
 *
 * - medicalDocumentInsight - A function that extracts key information and generates a summary from a medical document.
 * - MedicalDocumentInsightInput - The input type for the medicalDocumentInsight function.
 * - MedicalDocumentInsightOutput - The return type for the medicalDocumentInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const MedicalDocumentInsightInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The textual content of the medical document.'),
  documentType: z
    .enum(['lab_result', 'specialist_report', 'historical_note', 'other'])
    .describe('The type of medical document being processed.'),
});
export type MedicalDocumentInsightInput = z.infer<
  typeof MedicalDocumentInsightInputSchema
>;

// Output Schema
const MedicalDocumentInsightOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key information and most important details from the medical document.'
    ),
  criticalFindings: z
    .array(z.string())
    .describe(
      'A list of critical findings or abnormal results highlighted from the document.'
    ),
});
export type MedicalDocumentInsightOutput = z.infer<
  typeof MedicalDocumentInsightOutputSchema
>;

// Wrapper function
export async function medicalDocumentInsight(
  input: MedicalDocumentInsightInput
): Promise<MedicalDocumentInsightOutput> {
  return medicalDocumentInsightFlow(input);
}

// Prompt definition
const medicalDocumentInsightPrompt = ai.definePrompt({
  name: 'medicalDocumentInsightPrompt',
  input: {schema: MedicalDocumentInsightInputSchema},
  output: {schema: MedicalDocumentInsightOutputSchema},
  prompt: `You are an AI medical assistant specializing in extracting and summarizing key information from medical documents. Your task is to review the provided medical document, identify all critical findings, and generate a concise summary that highlights the most important details relevant to a medical professional.

Document Type: {{{documentType}}}

Document Content:
{{{documentContent}}}

Please provide the output in the following JSON format, ensuring that both a summary and a list of critical findings are always present. If there are no specific critical findings, return an empty array for 'criticalFindings'.
`,
});

// Flow definition
const medicalDocumentInsightFlow = ai.defineFlow(
  {
    name: 'medicalDocumentInsightFlow',
    inputSchema: MedicalDocumentInsightInputSchema,
    outputSchema: MedicalDocumentInsightOutputSchema,
  },
  async input => {
    const {output} = await medicalDocumentInsightPrompt(input);
    if (!output) {
      throw new Error('Failed to generate medical document insight.');
    }
    return output;
  }
);
