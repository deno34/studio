'use server';
/**
 * @fileOverview A flow to save early access requests to Firestore.
 *
 * - saveEarlyAccessRequest - Saves a user's request for early access.
 */
import {z} from 'genkit';
import {ai} from '@/ai/genkit';
import {db} from '@/lib/firebase';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import type {EarlyAccessRequest} from '@/lib/types';
import {EarlyAccessRequestSchema} from '@/lib/types';

const saveEarlyAccessFlow = ai.defineFlow(
  {
    name: 'saveEarlyAccessFlow',
    inputSchema: EarlyAccessRequestSchema,
    outputSchema: z.object({success: z.boolean(), message: z.string()}),
  },
  async (input) => {
    try {
      await addDoc(collection(db, 'earlyAccessRequests'), {
        ...input,
        createdAt: serverTimestamp(),
      });
      return {success: true, message: 'Successfully saved request.'};
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      return {
        success: false,
        message: `Failed to save request: ${errorMessage}`,
      };
    }
  }
);

export async function saveEarlyAccessRequest(
  input: EarlyAccessRequest
): Promise<{success: boolean; message: string}> {
  return saveEarlyAccessFlow(input);
}
