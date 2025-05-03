<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { artistSchema, composerSchema, pieceSchema, recordingSchema } from './schema';

    export let data;

    // artist form
    const {
        form: artistForm,
        errors: artistErrors,
        message: artistMessage,
        enhance: artistEnhance
    } = superForm(data.artistForm, {
        id: 'artistForm',
        validators: zodClient(artistSchema),
        resetForm: true
    });

    // composer form
    const {
        form: composerForm,
        errors: composerErrors,
        message: composerMessage,
        enhance: composerEnhance
    } = superForm(data.composerForm, {
        id: 'composerForm',
        validators: zodClient(composerSchema),
        resetForm: true
    });

    // piece form
    const {
        form: pieceForm,
        errors: pieceErrors,
        message: pieceMessage,
        enhance: pieceEnhance
    } = superForm(data.pieceForm, {
        id: 'pieceForm',
        validators: zodClient(pieceSchema),
        resetForm: true
    });

    // recording form
    const {
        form: recordingForm,
        errors: recordingErrors,
        message: recordingMessage,
        enhance: recordingEnhance
    } = superForm(data.recordingForm, {
        id: 'recordingForm',
        validators: zodClient(recordingSchema),
        resetForm: true
    });
</script>

<div class="container mx-auto p-4 space-y-8">
    <h1 class="text-2xl font-bold mb-6">Add New Data</h1>

    <!-- Add Artist Form -->
    <section class="p-6 border rounded-lg shadow-md bg-white">
        <h2 class="text-xl font-semibold mb-4">Add Artist</h2>
        {#if $artistMessage}
            <div
                    class="mb-4 p-3 rounded-md"
                    class:bg-green-100={$artistMessage === 'Insert successful!'}
                    class:text-green-700={$artistMessage === 'Insert successful!'}
                    class:bg-red-100={$artistMessage !== 'Insert successful!'}
                    class:text-red-700={$artistMessage !== 'Insert successful!'}
            >
                {$artistMessage}
            </div>
        {/if}
        <form method="POST" action="?/addArtist" use:artistEnhance class="space-y-4">
            <div>
                <label for="artist-name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                        type="text"
                        id="artist-name"
                        name="name"
                        bind:value={$artistForm.name}
                        aria-invalid={$artistErrors.name ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {#if $artistErrors.name}
                    <p class="mt-2 text-sm text-red-600">{$artistErrors.name}</p>
                {/if}
            </div>
            <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add Artist
            </button>
        </form>
    </section>

    <!-- Add Composer Form -->
    <section class="p-6 border rounded-lg shadow-md bg-white">
        <h2 class="text-xl font-semibold mb-4">Add Composer</h2>
        {#if $composerMessage}
            <div
                    class="mb-4 p-3 rounded-md"
                    class:bg-green-100={$composerMessage === 'Insert successful!'}
                    class:text-green-700={$composerMessage === 'Insert successful!'}
                    class:bg-red-100={$composerMessage !== 'Insert successful!'}
                    class:text-red-700={$composerMessage !== 'Insert successful!'}
            >
                {$composerMessage}
            </div>
        {/if}
        <form method="POST" action="?/addComposer" use:composerEnhance class="space-y-4">
            <div>
                <label for="composer-name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                        type="text"
                        id="composer-name"
                        name="name"
                        bind:value={$composerForm.name}
                        aria-invalid={$composerErrors.name ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {#if $composerErrors.name}
                    <p class="mt-2 text-sm text-red-600">{$composerErrors.name}</p>
                {/if}
            </div>
            <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add Composer
            </button>
        </form>
    </section>

    <!-- Add Piece Form -->
    <section class="p-6 border rounded-lg shadow-md bg-white">
        <h2 class="text-xl font-semibold mb-4">Add Piece</h2>
        {#if $pieceMessage}
            <div
                    class="mb-4 p-3 rounded-md"
                    class:bg-green-100={$pieceMessage === 'Insert successful!'}
                    class:text-green-700={$pieceMessage === 'Insert successful!'}
                    class:bg-red-100={$pieceMessage !== 'Insert successful!'}
                    class:text-red-700={$pieceMessage !== 'Insert successful!'}
            >
                {$pieceMessage}
            </div>
        {/if}
        <form method="POST" action="?/addPiece" use:pieceEnhance class="space-y-4">
            <div>
                <label for="piece-name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                        type="text"
                        id="piece-name"
                        name="name"
                        bind:value={$pieceForm.name}
                        aria-invalid={$pieceErrors.name ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {#if $pieceErrors.name}
                    <p class="mt-2 text-sm text-red-600">{$pieceErrors.name}</p>
                {/if}
            </div>
            <div>
                <label for="piece-catalog" class="block text-sm font-medium text-gray-700"
                >Catalog Number</label
                >
                <input
                        type="text"
                        id="piece-catalog"
                        name="catalogNumber"
                        bind:value={$pieceForm.catalogNumber}
                        aria-invalid={$pieceErrors.catalogNumber ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {#if $pieceErrors.catalogNumber}
                    <p class="mt-2 text-sm text-red-600">{$pieceErrors.catalogNumber}</p>
                {/if}
            </div>
            <div>
                <label for="piece-composer" class="block text-sm font-medium text-gray-700">Composer</label>
                <select
                        id="piece-composer"
                        name="composerId"
                        bind:value={$pieceForm.composerId}
                        aria-invalid={$pieceErrors.composerId ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="" disabled selected>Select a composer</option>
                    {#each data.composers as composer}
                        <option value={composer.id}>{composer.name}</option>
                    {/each}
                </select>
                {#if $pieceErrors.composerId}
                    <p class="mt-2 text-sm text-red-600">{$pieceErrors.composerId}</p>
                {/if}
            </div>
            <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add Piece
            </button>
        </form>
    </section>

    <!-- Add Recording Form -->
    <section class="p-6 border rounded-lg shadow-md bg-white">
        <h2 class="text-xl font-semibold mb-4">Add Recording</h2>
        {#if $recordingMessage}
            <div
                    class="mb-4 p-3 rounded-md"
                    class:bg-green-100={$recordingMessage === 'Insert successful!'}
                    class:text-green-700={$recordingMessage === 'Insert successful!'}
                    class:bg-red-100={$recordingMessage !== 'Insert successful!'}
                    class:text-red-700={$recordingMessage !== 'Insert successful!'}
            >
                {$recordingMessage}
            </div>
        {/if}
        <form method="POST" action="?/addRecording" use:recordingEnhance class="space-y-4">
            <div>
                <label for="recording-piece" class="block text-sm font-medium text-gray-700">Piece</label>
                <select
                        id="recording-piece"
                        name="pieceId"
                        bind:value={$recordingForm.pieceId}
                        aria-invalid={$recordingErrors.pieceId ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="" disabled selected>Select a piece</option>
                    {#each data.pieces as piece}
                        <option value={piece.id}>{data.composers.find(c => c.id  === piece.composer_id).name}: {piece.name} ({piece.catalog_number})</option>
                    {/each}
                </select>
                {#if $recordingErrors.pieceId}
                    <p class="mt-2 text-sm text-red-600">{$recordingErrors.pieceId}</p>
                {/if}
            </div>
            <div>
                <label for="recording-artist" class="block text-sm font-medium text-gray-700">Artist</label>
                <select
                        id="recording-artist"
                        name="artistId"
                        bind:value={$recordingForm.artistId}
                        aria-invalid={$recordingErrors.artistId ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="" disabled selected>Select an artist</option>
                    {#each data.artists as artist}
                        <option value={artist.id}>{artist.name}</option>
                    {/each}
                </select>
                {#if $recordingErrors.artistId}
                    <p class="mt-2 text-sm text-red-600">{$recordingErrors.artistId}</p>
                {/if}
            </div>
            <div>
                <label for="recording-url" class="block text-sm font-medium text-gray-700">URL</label>
                <input
                        type="url"
                        id="recording-url"
                        name="url"
                        bind:value={$recordingForm.url}
                        aria-invalid={$recordingErrors.url ? 'true' : undefined}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {#if $recordingErrors.url}
                    <p class="mt-2 text-sm text-red-600">{$recordingErrors.url}</p>
                {/if}
            </div>
            <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add Recording
            </button>
        </form>
    </section>
</div>