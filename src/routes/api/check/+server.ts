import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Type to represent a game being played.
 */
type Game = {
    userId: string;
    setId: number;
    isComposerSet: boolean;
}

/**
 * Map to store the scores of each game.
 */
let scores = new Map<string, number>();

/**
 * Function to get a key for a game based on its user ID, set ID, and whether it's a composer set.
 * @param game - The game object containing user ID, set ID, and isComposerSet flag.
 */
function getGameKey(game: Game): string {
    return `${game.userId}-${game.setId}-${game.isComposerSet}`;
}

/**
 * Function to check the answers for the composer and piece and update scores on the backend.
 * @param request - The request object containing the answers.
 * @param supabase - The Supabase client for database operations.
 * @constructor
 */
export const POST: RequestHandler = async ({ request, locals: { user, supabase } }) => {
    // get answers
    const requestData = await request.json();
    const { recordingId, composerAnswer, pieceAnswer, round, currentPlaytime, totalDuration, isComposerSet, setId } = requestData;

    // get piece id from database
    const { data: piece_id, error } = await supabase
        .from('recordings')
        .select('piece_id')
        .eq('id', recordingId)
        .single();
    if (error) {
        console.error('Error loading piece id:', error);
        return json({ score: -1 });
    }

    // get piece from piece id
    const { data: piece, error: pieceError } = await supabase
        .from('pieces')
        .select('id, catalog_number, composer_id')
        .eq('id', piece_id.piece_id)
        .single();
    if (pieceError) {
        console.error('Error loading piece:', pieceError);
        return json({ score: -1 });
    }

    // get composer from composer id
    const { data: composer, error: composerError } = await supabase
        .from('composers')
        .select('id, name')
        .eq('id', piece.composer_id)
        .single();
    if (composerError) {
        console.error('Error loading composer:', composerError);
        return json({ score: -1 });
    }

    // check if answers are correct
    const isComposerCorrect = composer.id === composerAnswer;
    const isPieceCorrect = piece.id === pieceAnswer;
    const success = isComposerCorrect && isPieceCorrect;

    // calculate the score based on correctness and time, with a buffer of 5 seconds
    const timeFactor = (currentPlaytime < 5 ? 0 : currentPlaytime) / (totalDuration / 5);
    let calculatedScore = 0;
    if (isComposerSet) {
        if (success) {
            // both correct: Full points exponentially scaled by time
            calculatedScore = 5000 * Math.pow(2.72, -1 * timeFactor);
        } else {
            // both incorrect: 0 points
            calculatedScore = 0;
        }
    } else {
        if (success) {
            // both correct: Full points exponentially scaled by time
            calculatedScore = 2500 * Math.pow(2.72, -1 * timeFactor) + 2500;
        } else if (isComposerCorrect) {
            // partially correct: Half points exponentially scaled by time
            calculatedScore = 2500 * Math.pow(2.72, -1 * timeFactor);
        } else {
            // both incorrect: 0 points
            calculatedScore = 0;
        }
    }

    // ensure score is not negative and round it
    calculatedScore = Math.max(0, Math.round(calculatedScore));
    if (!user) {
        console.error('User not found');
        return json({ score: calculatedScore });
    }

    console.log("---- Round " + round + " ----");
    console.log("Round score: " + calculatedScore);

    // update score in the map
    if (round === 0) {
        scores.set(getGameKey({ userId: user.id, setId, isComposerSet }), calculatedScore);
    } else {
        const currentScore = scores.get(getGameKey({ userId: user.id, setId, isComposerSet })) || 0;
        console.log("Current score: " + currentScore);
        calculatedScore += currentScore;
        scores.set(getGameKey({ userId: user.id, setId, isComposerSet }), calculatedScore);
    }

    console.log("Total score: " + calculatedScore);

    // if last round, save score to database
    if (round === 4) {
        // get previous max score
        const { data: previousMaxScore, error: previousMaxScoreError } = await supabase
            .from('scores')
            .select('score')
            .eq('user_id', user.id)
            .eq('set_id', setId)
            .limit(1)
            .single();
        if (previousMaxScoreError) {
            console.error('Error loading previous max score:', previousMaxScoreError);
            return json({ score: calculatedScore });
        }

        // check if new score is higher
        if (previousMaxScore && previousMaxScore.score < calculatedScore) {
            // update score in database
            if (isComposerSet) {
                const {error: updateError} = await supabase
                    .from('scores')
                    .update({score: calculatedScore})
                    .eq('user_id', user.id)
                    .eq('composer_id', setId);
                if (updateError) {
                    console.error('Error updating score:', updateError);
                    return json({score: calculatedScore});
                }
            } else {
                const {error: updateError} = await supabase
                    .from('scores')
                    .update({score: calculatedScore})
                    .eq('user_id', user.id)
                    .eq('set_id', setId);
                if (updateError) {
                    console.error('Error updating score:', updateError);
                    return json({score: calculatedScore});
                }
            }
        } else if (!previousMaxScore) {
            // insert new score in database
            if (isComposerSet) {
                const {error: insertError} = await supabase
                    .from('scores')
                    .insert({user_id: user.id, composer_id: setId, score: calculatedScore});
                if (insertError) {
                    console.error('Error inserting score:', insertError);
                    return json({score: calculatedScore});
                }
            } else {
                const {error: insertError} = await supabase
                    .from('scores')
                    .insert({user_id: user.id, set_id: setId, score: calculatedScore});
                if (insertError) {
                    console.error('Error inserting score:', insertError);
                    return json({score: calculatedScore});
                }
            }
        }
    }

    return json({ score: calculatedScore });
};