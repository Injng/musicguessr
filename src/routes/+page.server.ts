import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from "./schema";
import { message, setError } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ locals: { session } }) => {
    // if user is already logged in, redirect to private area
    if (session) {
        redirect(303, '/play');
    }
    
    // initialize the login form with superforms
    const form = await superValidate(zod(loginSchema));

    return { form };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // validate the form data
        const form = await superValidate(request, zod(loginSchema));

        // if data is invalid, return a 400 error with the form data
        if (!form.valid) {
            return fail(400, { form });
        }

        // attempt to sign in the user with supabase
        const { error } = await locals.supabase.auth.signInWithPassword({
            email: form.data.username,
            password: form.data.password
        });

        // if there is an error, set the error message on the form
        if (error) {
            return message(form, 'Invalid email or password');
        }

        // return success
        return message(form, 'Login successful!');
    }
};
