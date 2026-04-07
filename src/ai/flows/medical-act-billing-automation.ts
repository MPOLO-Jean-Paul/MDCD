'use server';
/**
 * @fileOverview A Genkit flow that interprets medical act details and automatically generates
 *               corresponding billing line items based on a provided pricing catalog.
 *
 * - medicalActBillingAutomation - The main function to trigger the billing automation process.
 * - MedicalActBillingAutomationInput - The input type for the medicalActBillingAutomation function.
 * - MedicalActBillingAutomationOutput - The return type for the medicalActBillingAutomation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicalActBillingAutomationInputSchema = z.object({
  medicalActDescription: z.string().describe('A detailed description of the medical act performed by the professional.'),
  medicalActCategory: z.string().describe('The category of the medical act (e.g., Consultation, Laboratoire, Imagerie, Hospitalisation).'),
  patientId: z.string().describe('The unique identifier of the patient for context.'),
  pricingCatalog: z.string().describe('A JSON string representing the hospital\'s pricing catalog. Each item should have \'code\', \'name\', \'price\', and \'description\'. Example: [{\"code\": \"CONSULT_GEN\", \"name\": \"Consultation générale\", \"price\": 50.00, \"description\": \"Consultation médicale de routine\"}]'),
});

export type MedicalActBillingAutomationInput = z.infer<typeof MedicalActBillingAutomationInputSchema>;

const BillingLineItemSchema = z.object({
  serviceName: z.string().describe('The name of the billed service, exactly as it appears in the pricing catalog.'),
  serviceCode: z.string().describe('The unique code of the billed service, exactly as it appears in the pricing catalog.'),
  unitPrice: z.number().describe('The price per unit of the service, as per the pricing catalog.'),
  quantity: z.number().int().positive().describe('The quantity of the service provided. Must be a positive integer.'),
  totalPrice: z.number().describe('The total price for this line item (unitPrice * quantity).'),
  justification: z.string().describe('A brief explanation of why this service was billed based on the medical act description.'),
});

const MedicalActBillingAutomationOutputSchema = z.object({
  billingLines: z.array(BillingLineItemSchema).describe('An array of automatically generated billing line items.'),
  totalAmount: z.number().describe('The total sum of all billing line items.'),
  notes: z.string().optional().describe('Any additional notes or discrepancies encountered during billing generation.'),
});

export type MedicalActBillingAutomationOutput = z.infer<typeof MedicalActBillingAutomationOutputSchema>;

const prompt = ai.definePrompt({
  name: 'medicalActBillingPrompt',
  input: { schema: MedicalActBillingAutomationInputSchema },
  output: { schema: MedicalActBillingAutomationOutputSchema },
  prompt: `You are an expert in medical billing and hospital financial management. Your task is to analyze a medical act description and automatically generate accurate billing line items based on a provided pricing catalog.

Strictly adhere to the following rules:
1.  **Analyze the Medical Act**: Carefully read the 'medicalActDescription' and 'medicalActCategory' to understand all services rendered.
2.  **Use the Pricing Catalog**: Match the services identified in the medical act to the services listed in the 'pricingCatalog' (provided as a JSON string). Only use services that exist in this catalog.
3.  **Generate Billing Lines**: For each identified service, create a 'billingLine' item including 'serviceName', 'serviceCode', 'unitPrice', 'quantity', 'totalPrice', and 'justification'.
4.  **Quantity**: Default quantity to 1 unless the description clearly indicates multiple units.
5.  **Accuracy**: Ensure 'unitPrice' and 'serviceCode' directly match the catalog. Calculate 'totalPrice' correctly.
6.  **Justification**: Provide a concise justification for each billed item, linking it directly to the medical act description.
7.  **Total Amount**: Calculate the 'totalAmount' by summing all 'totalPrice' values.
8.  **Strict JSON Output**: The output MUST be a JSON object conforming precisely to the MedicalActBillingAutomationOutputSchema.

Medical Act Description: {{{medicalActDescription}}}
Medical Act Category: {{{medicalActCategory}}}
Patient ID: {{{patientId}}}

Pricing Catalog (JSON Array of Objects with code, name, price, description):
{{{pricingCatalog}}}
`,
});

const medicalActBillingAutomationFlow = ai.defineFlow(
  {
    name: 'medicalActBillingAutomationFlow',
    inputSchema: MedicalActBillingAutomationInputSchema,
    outputSchema: MedicalActBillingAutomationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate billing output.');
    }
    return output;
  },
);

export async function medicalActBillingAutomation(input: MedicalActBillingAutomationInput): Promise<MedicalActBillingAutomationOutput> {
  return medicalActBillingAutomationFlow(input);
}
