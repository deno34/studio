
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
import { generateRestockSuggestions } from '@/ai/flows/restock-suggestion-flow';
import { InventoryItem, RestockSuggestionInput } from '@/lib/types';

// const db = admin.firestore();

export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // MOCK DATA
    const inventoryItems: Partial<InventoryItem>[] = [
        { name: 'Wireless Mouse', sku: 'WM-GRY-01', stockLevel: 15, reorderLevel: 30 },
        { name: 'External Webcam', sku: 'CAM-HD-01', stockLevel: 8, reorderLevel: 10 },
    ];

    if (inventoryItems.length === 0) {
        return NextResponse.json({ suggestions: [] });
    }

    const input: RestockSuggestionInput = {
        inventoryItems: inventoryItems.map(item => ({
            name: item.name!,
            sku: item.sku!,
            stockLevel: item.stockLevel!,
            reorderLevel: item.reorderLevel!,
        }))
    };
    
    const result = await generateRestockSuggestions(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[RESTOCK_SUGGESTION_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during suggestion generation.', details: error.message }, { status: 500 });
  }
}
