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

    return { sets }
};
