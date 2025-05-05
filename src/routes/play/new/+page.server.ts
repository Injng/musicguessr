import type {Actions} from "../../../../.svelte-kit/types/src/routes/$types";
import {message, superValidate} from "sveltekit-superforms";
import {zod} from "sveltekit-superforms/adapters";
import {fail} from "@sveltejs/kit";
import {setRecordingSchema, setSchema} from "./schema";

export const load = async ({ locals: { session, supabase } }) => {
    // fetch data needed for dropdowns
    const [
        { data: artists, error: artistsError },
        { data: composers, error: composersError },
        { data: pieces, error: piecesError },
        { data: recordings, error: recordingsError },
        { data: sets, error: setsError }
    ] = await Promise.all([
        supabase.from('artists').select('id, name'),
        supabase.from('composers').select('id, name'),
        supabase.from('pieces').select('id, name, composer_id'),
        supabase.from('recordings').select('id, piece_id, artist_id, url'),
        supabase.from('sets').select('id, name, description').eq('owner_id', session?.user.id),
    ]);

    // initialize forms
    const setForm = await superValidate(zod(setSchema));
    const setRecordingForm = await superValidate(zod(setRecordingSchema));

    return {
        setForm,
        setRecordingForm,
        artists: artists ?? [],
        composers: composers ?? [],
        pieces: pieces ?? [],
        recordings: recordings ?? [],
        sets: sets ?? [],
    }
}

export const actions: Actions = {
    addSet: async ({ request, locals: { session, supabase } }) => {
        // validate the form data
        const form = await superValidate(request, zod(setSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // add set to the database
        const { data, error } = await supabase
            .from('sets')
            .insert([
                {
                    name: form.data.name,
                    description: form.data.description,
                    owner_id: session?.user.id,
                }
            ])
            .select();

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Database insert failed');
        }

        // return success
        return message(form, 'Add set successful!');
    },

    addSetRecording: async ({ request, locals }) => {
        // validate the form data
        const form = await superValidate(request, zod(setRecordingSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // add recording to the set
        const { data, error } = await locals.supabase
            .from('set_recordings')
            .insert([
                {
                    recording_id: form.data.recordingId,
                    set_id: form.data.setId,
                }
            ])
            .select();

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Database insert failed');
        }

        // return success
        return message(form, 'Add set recording successful!');
    }
};
