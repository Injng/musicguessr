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

    // load list of all pieces
    const { data: pieces, error: pieceError } = await supabase
        .from('pieces')
        .select('id, name, composer_id');
    if (pieceError) {
        console.error('Error loading pieces:', pieceError);
        return { status: 500, error: 'Failed to load pieces' };
    }

    // load list of recording IDs for the initial composer's pieces 
    const { data: initialPieces, error: initialPieceError } = await supabase
        .from('pieces')
        .select('id')
        .eq('composer_id', params.slug);

    if (initialPieceError) {
        console.error('Error loading initial pieces:', initialPieceError);
        return { status: 500, error: 'Failed to load initial pieces' };
    }

    const { data: setRecordings, error: setRecordingsError } = await supabase
        .from('recordings')
        .select('id')
        .in('piece_id', initialPieces?.map(p => p.id) || []); 
    if (setRecordingsError) {
        console.error('Error loading set recordings:', setRecordingsError);
        return { status: 500, error: 'Failed to load set recordings' };
    }

    // select five random recording IDs in random order with Fisher-Yates shuffle
    const allRecordingIds = setRecordings.map(r => r.id);
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

    // create a map for quick lookup
    const recordingMap = new Map(recordings?.map(r => [r.id, r]) || []);
    const orderedRecordings = recordingIds.map(id => recordingMap.get(id)).filter(r => r !== undefined) as RecordingWithDetails[];

    // map the data to a flatter structure for easier use in the frontend
    const formattedRecordings = orderedRecordings?.map(r => ({
        id: r.id,
        url: r.url,
        artistName: r.artists?.name ?? 'Unknown Artist',
        pieceName: r.pieces?.name ?? 'Unknown Piece',
        composerName: r.pieces?.composers?.name ?? 'Unknown Composer'
    })) || [];

    return {
        composers: composers || [],
        pieces: pieces || [],
        recordings: formattedRecordings,
        setId: params.slug,
    };
};
