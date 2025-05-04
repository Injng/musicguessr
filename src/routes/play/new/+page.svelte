<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { setSchema, setRecordingSchema } from './schema';

	export let data;

	// Reactive variables for filtering
	let selectedComposerId: number | null = null;
	let selectedPieceId: number | null = null;
	let selectedArtistId: number | null = null;

	// Filtered data based on selections
	$: filteredPieces = selectedComposerId
		? data.pieces.filter((p) => p.composer_id === selectedComposerId)
		: data.pieces;

	$: filteredRecordings = data.recordings.filter((r) => {
		const pieceMatch = selectedPieceId ? r.piece_id === selectedPieceId : true;
		const artistMatch = selectedArtistId ? r.artist_id === selectedArtistId : true;
		const composerMatch = selectedComposerId && !selectedPieceId
			? data.pieces.find(p => p.id === r.piece_id)?.composer_id === selectedComposerId
			: true;
		return pieceMatch && artistMatch && composerMatch;
	});

	// Reset piece and recording selection when composer changes
	$: {
		if (selectedComposerId) {
			selectedPieceId = null;
			selectedArtistId = null; // Also reset artist if desired when composer changes
		}
	}
	// Reset recording selection when piece changes
	$: {
		if (selectedPieceId) {
			// Optionally reset artist when piece changes, or keep it
			// selectedArtistId = null;
		}
	}


	// Form for adding a new set
	const setForm = superForm(data.setForm, {
		validators: zodClient(setSchema),
		resetForm: true,
		invalidateAll: true, // To refresh the sets list after adding
	});
	const { form: setFormData, enhance: setEnhance, message: setFormMessage } = setForm;

	// Form for adding a recording to a set
	const setRecordingForm = superForm(data.setRecordingForm, {
		validators: zodClient(setRecordingSchema),
		resetForm: true,
	});
	const { form: setRecordingFormData, enhance: setRecordingEnhance, message: setRecordingFormMessage } = setRecordingForm;

</script>

<div class="container mx-auto p-4 space-y-8">
	<h1 class="text-2xl font-bold mb-6">Create New Set or Add Recording</h1>

	<section class="p-6 border rounded-lg shadow-md bg-white">
		<h2 class="text-xl font-semibold mb-4">Create New Set</h2>
		{#if $setFormMessage}
			<div
				class="mb-4 p-3 rounded-md"
				class:bg-green-100={$setFormMessage === 'Add set successful!'}
				class:text-green-700={$setFormMessage === 'Add set successful!'}
				class:bg-red-100={$setFormMessage !== 'Add set successful!'}
				class:text-red-700={$setFormMessage !== 'Add set successful!'}
			>
				{$setFormMessage}
			</div>
		{/if}
		<form method="POST" action="?/addSet" use:setEnhance class="space-y-4">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Set Name:</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={$setFormData.name}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
				<!-- Add error display if needed -->
			</div>
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700">Description (Optional):</label>
				<textarea
					id="description"
					name="description"
					bind:value={$setFormData.description}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				></textarea>
				<!-- Add error display if needed -->
			</div>
			<button
				type="submit"
				class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Create Set
			</button>
		</form>
	</section>

	<hr class="my-8" />

	<section class="p-6 border rounded-lg shadow-md bg-white">
		<h2 class="text-xl font-semibold mb-4">Add Recording to Set</h2>
		{#if $setRecordingFormMessage}
			<div
				class="mb-4 p-3 rounded-md"
				class:bg-green-100={$setRecordingFormMessage === 'Add set recording successful!'}
				class:text-green-700={$setRecordingFormMessage === 'Add set recording successful!'}
				class:bg-red-100={$setRecordingFormMessage !== 'Add set recording successful!'}
				class:text-red-700={$setRecordingFormMessage !== 'Add set recording successful!'}
			>
				{$setRecordingFormMessage}
			</div>
		{/if}

		<!-- Filters -->
		<div class="space-y-4 mb-6">
			<div>
				<label for="composer-filter" class="block text-sm font-medium text-gray-700">Filter by Composer:</label>
				<select
					id="composer-filter"
					bind:value={selectedComposerId}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					<option value={null}>All Composers</option>
					{#each data.composers as composer}
						<option value={composer.id}>{composer.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="piece-filter" class="block text-sm font-medium text-gray-700">Filter by Piece:</label>
				<select
					id="piece-filter"
					bind:value={selectedPieceId}
					disabled={!selectedComposerId && filteredPieces.length === data.pieces.length}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
				>
					<option value={null}>All Pieces</option>
					{#each filteredPieces as piece}
						<option value={piece.id}>{piece.name} ({piece.catalog_number})</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="artist-filter" class="block text-sm font-medium text-gray-700">Filter by Artist:</label>
				<select
					id="artist-filter"
					bind:value={selectedArtistId}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					<option value={null}>All Artists</option>
					{#each data.artists as artist}
						<option value={artist.id}>{artist.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Form -->
		<form method="POST" action="?/addSetRecording" use:setRecordingEnhance class="space-y-4">
			<div>
				<label for="recordingId" class="block text-sm font-medium text-gray-700">Select Recording:</label>
				<select
					id="recordingId"
					name="recordingId"
					bind:value={$setRecordingFormData.recordingId}
					required
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					<option value="" disabled selected>-- Select a Recording --</option>
					{#each filteredRecordings as recording}
						<option value={recording.id}>
							{recording.url}
						</option>
					{/each}
				</select>
				<!-- Add error display if needed -->
			</div>

			<div>
				<label for="setId" class="block text-sm font-medium text-gray-700">Select Set:</label>
				<select
					id="setId"
					name="setId"
					bind:value={$setRecordingFormData.setId}
					required
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					<option value="" disabled selected>-- Select a Set --</option>
					{#each data.sets as set}
						<option value={set.id}>{set.name}</option>
					{/each}
				</select>
				<!-- Add error display if needed -->
			</div>

			<button
				type="submit"
				class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Add Recording to Set
			</button>
		</form>
	</section>
</div>
