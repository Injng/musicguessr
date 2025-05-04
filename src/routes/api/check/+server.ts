import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    // get answers
    const requestData = await request.json();
    const { recordingId, composerAnswer, catalogAnswer } = requestData;

    // get piece id from database
    const { data: piece_id, error } = await supabase
        .from('recordings')
        .select('piece_id')
        .eq('id', recordingId)
        .single();
    if (error) {
        console.error('Error loading piece id:', error);
        return json({ success: false });
    }

    // get piece from piece id
    const { data: piece, error: pieceError } = await supabase
        .from('pieces')
        .select('id, catalog_number, composer_id')
        .eq('id', piece_id.piece_id)
        .single();
    if (pieceError) {
        console.error('Error loading piece:', pieceError);
        return json({ success: false });
    }

    // get composer from composer id
    const { data: composer, error: composerError } = await supabase
        .from('composers')
        .select('id, name')
        .eq('id', piece.composer_id)
        .single();
    if (composerError) {
        console.error('Error loading composer:', composerError);
        return json({ success: false });
    }

    // check if answers are correct
    const isComposerCorrect = composer.id === composerAnswer;
    const isCatalogCorrect = piece.catalog_number.replace(/ /g, '').toLowerCase()
        === catalogAnswer.replace(/ /g, '').toLowerCase();

    const success = isComposerCorrect && isCatalogCorrect;

    // Return detailed results
    return json({ success, isComposerCorrect, isCatalogCorrect });
};