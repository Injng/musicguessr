import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    // load all composer from database
    const { data: composers, error: composerError } = await supabase
        .from('composers')
        .select('id, name');
    if (composerError) {
        console.error('Error loading composer:', composerError);
        return { status: 500, error: 'Failed to load composer' };
    }

    // load list of recording IDs for the set
    const { data: setRecordings, error: setRecordingsError } = await supabase
        .from('set_recordings')
        .select('recording_id')
        .eq('set_id', params.slug);
    if (setRecordingsError) {
        console.error('Error loading set recordings:', setRecordingsError);
        return { status: 500, error: 'Failed to load set recordings' };
    }

    // select five random recording IDs in random order with Fisher-Yates shuffle
    const allRecordingIds = setRecordings.map(r => r.recording_id);
    for (let i = allRecordingIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allRecordingIds[i], allRecordingIds[j]] = [allRecordingIds[j], allRecordingIds[i]];
    }
    const recordingIds = allRecordingIds.slice(0, 5);

    // load details for the selected recordings, including piece, composer, and artist info
    type RecordingWithDetails = {
        id: number;
        url: string;
        artists: {
            name: string | null;
        } | null;
        pieces: {
            name: string | null;
            composers: {
                name: string | null;
            } | null;
        } | null;
    };

    const { data: recordings, error: recordingError } = await supabase
        .from('recordings')
        .select(`
            id,
            url,
            artists ( name ),
            pieces (
                name,
                composers ( name )
            )
        `)
        .in('id', recordingIds)
        .returns<RecordingWithDetails[]>();

    if (recordingError) {
        console.error('Error loading recording details:', recordingError);
        return { status: 500, error: 'Failed to load recording details' };
    }

    // map the data to a flatter structure for easier use in the frontend
    const formattedRecordings = recordings?.map(r => ({
        id: r.id,
        url: r.url,
        artistName: r.artists?.name ?? 'Unknown Artist',
        pieceName: r.pieces?.name ?? 'Unknown Piece',
        composerName: r.pieces?.composers?.name ?? 'Unknown Composer'
    })) || [];

    // shuffle the recordings again to ensure randomness
    for (let i = formattedRecordings.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [formattedRecordings[i], formattedRecordings[j]] = [formattedRecordings[j], formattedRecordings[i]];
    }

    return {
        composers: composers || [],
        recordings: formattedRecordings,
        setId: params.slug,
    };
};
