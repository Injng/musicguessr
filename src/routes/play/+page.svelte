<script lang="ts">
    import type { PageData } from './$types';
    import {goto} from "$app/navigation";
    import { superForm } from 'sveltekit-superforms';

    let { data }: { data: PageData } = $props();
    const { sets } = data;
    let showProfile = $state(false);

    function addSet() {
        goto('/play/new');
    }

    function playSet(setId: number) {
        goto(`/play/set/${setId}`);
    }

    // get superform data
    const { form, message, errors, enhance: superEnhance } = superForm(data.form);
</script>

<div class="absolute top-4 right-4">
    <button onclick={() => showProfile = true}
            class="block p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="User Profile">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </button>
</div>

{#if showProfile}
    <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 class="text-xl font-semibold mb-4">User Profile</h2>
            <form method="POST" use:superEnhance class="mt-8 space-y-6">
                <div>
                    <label for="displayName" class="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            bind:value={$form.displayName}
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {#if $errors.displayName}
                        <p class="mt-1 text-sm text-red-600">{$errors.displayName}</p>
                    {/if}
                </div>

                <div>
                    <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            </form>
            <button
                    type="button"
                    class="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onclick={() => {
                        data.supabase.auth.signOut().then(() => {
                            goto('/');
                        });
                    }}
            >
                Logout
            </button>
            <button onclick={() => showProfile = false} class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                Close
            </button>
        </div>
    </div>
{/if}

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Available Sets</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#if sets && sets.length > 0}
            {#each sets as set (set.id)}
                <div class="p-4 border rounded-lg shadow-sm flex flex-col justify-between bg-white">
                    <div>
                        <h2 class="text-xl font-semibold mb-2">{set.name}</h2>
                        {#if set.description}
                            <p class="text-gray-600 text-sm mb-4">{set.description}</p>
                        {/if}
                    </div>
                    <button class="mt-auto w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        onclick={() => playSet(set.id)}>
                        Play Set
                    </button>
                </div>
            {/each}
        {/if}

        <!-- Add New Set Card -->
        <button
                onclick={addSet}
                class="p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition duration-200 min-h-[150px]"
                aria-label="Add new set"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span class="font-semibold">Add New Set</span>
        </button>
    </div>
</div>