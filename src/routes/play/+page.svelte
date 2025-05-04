<script lang="ts">
    import type { PageData } from './$types';
    import {goto} from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const { sets } = data;

    function addSet() {
        goto('/play/new');
    }

    function playSet(setId: number) {
        goto(`/play/set/${setId}`);
    }
</script>

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