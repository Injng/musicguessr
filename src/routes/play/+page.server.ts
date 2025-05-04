import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import {userSchema} from "./schema";

export const load = async ({ locals: { supabase } }) => {
    // load list of sets
    const { data: sets, error } = await supabase
        .from('sets')
        .select('*');
    if (error) {
        console.error('Error loading sets:', error);
        return {
            sets: []
        };
    }

    // initialize the form with superforms
    const form = await superValidate(zod(userSchema));

    return { form, sets }
};

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        // validate the form data
        const form = await superValidate(request, zod(userSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // update display name in supabase
        const { error } = await supabase.auth.updateUser({
            data: {
                displayName: form.data.displayName
            }
        })

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Invalid display name');
        }

        // return success
        return message(form, 'Update successful!');
    }
};
