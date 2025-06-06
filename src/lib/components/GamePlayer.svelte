<script lang="ts">
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import Select from 'svelte-select';

    type Composer = { id: number; name: string };
    type Piece = { id: number; name: string; composer_id: number };
    type Recording = {
        id: number;
        url: string;
        artistName: string;
        pieceName: string;
        composerName: string;
    };

    let { composers = [], pieces = [], recordings = [], setId, isComposerSet }: {
        composers: Composer[];
        pieces: Piece[];
        recordings: Recording[];
        setId: string;
        isComposerSet: boolean;
    } = $props();

    // keep track of the rounds the user is on
    let round = $state(0);
    let score = $state(0);
    let startTime = 0;
    let player: any;
    let submitted = $state(false);
    let currentScore = $state(0);
    let isNewBest = $state(false);

    // animated score
    const animatedScore = tweened(0, {
        duration: 1000,
        easing: cubicOut
    });

    // user answers
    let selectedComposer: { value: number; label: string } | null = $state(null);
    let selectedPiece: { value: number; label: string } | null = $state(null);

    // Map data for svelte-select
    let composerOptions = $derived((composers ?? []).map(c => ({ value: c.id, label: c.name })));
    let pieceOptions = $derived(
        (pieces ?? [])
            .filter(p => p.composer_id === selectedComposer?.value)
            .map(p => ({ value: p.id, label: `${p.name}` }))
    );

    /**
     * Handle and check the user's answer
     */
    async function submit() {
        if (player) {
            player.pauseVideo();
        }
        // calculate how long the audio has played
        let currentPlaytime = player.getCurrentTime() - startTime;

        const currentRecording = recordings?.[round];
        if (!currentRecording) {
            console.error("Current recording not found");
            return; // Exit if no recording data
        }

        // build the request body and fetch the result
        let body = JSON.stringify({
            recordingId: currentRecording.id,
            composerAnswer: selectedComposer?.value,
            pieceAnswer: selectedPiece?.value,
            round,
            currentPlaytime,
            isComposerSet,
            setId,
        })
        let response = await fetch('/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body,
        })
        let result = await response.json();

        // ensure score is not negative and round it
        currentScore = result.score - score;
        score = result.score;
        isNewBest = result.isNewBest; 
        submitted = true;
        await animatedScore.set(currentScore);
    }

    /**
     * Proceed to the next round
     */
    async function nextRound() {
        if (recordings && round < recordings.length - 1) {
            // update all the state variables
            round += 1;
            submitted = false;
            selectedComposer = null;
            selectedPiece = null;
            currentScore = 0;
            isNewBest = false; 
            await animatedScore.set(0, {duration: 0});

            // destroy the current player instance and reinitialize
            if (player && typeof player.destroy === 'function') {
                player.destroy();
            }
            initPlayer();
        }
    }

    /**
     * Extract the video ID from the YouTube URL
     * @param url The YouTube URL
     */
    function extractId(url: string) {
        return url.split('v=')[1]?.split('&')[0];
    }

    /**
     * YouTube player integration
     */
    function initPlayer() {
        const YT = (window as any).YT;
        if (!YT || !YT.Player) {
            console.error("YouTube Player API not ready");
            return;
        }
        const currentRecording = recordings?.[round];
        if (!currentRecording?.url) {
            console.error("Recording URL not found for the current round.");
            return; // Exit if no URL
        }
        const videoId = extractId(currentRecording.url);
        if (!videoId) {
            console.error("Could not extract video ID from URL:", currentRecording.url);
            return; // Exit if ID extraction fails
        }

        player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0
            },
            events: {
                onReady: onPlayerReady,
            }
        });
    }

    function onPlayerReady(event: any) {
        const duration = player.getDuration();
        const buffer = Math.min(30, duration / 2);
        const maxStartTime = Math.max(0, duration - buffer);
        startTime = Math.floor(Math.random() * maxStartTime);
        player.seekTo(startTime, true);
        player.playVideo();
    }

    onMount(() => {
        const loadYouTubeAPI = () => {
            const globalWindow = window as any;
            if (!globalWindow.YT || !globalWindow.YT.Player) {
                globalWindow.onYouTubeIframeAPIReady = () => {
                    console.log("YouTube API Ready");
                    initPlayer();
                };

                if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                    const tag = document.createElement('script');
                    tag.src = 'https://www.youtube.com/iframe_api';
                    document.head.appendChild(tag);
                    console.log("YouTube API script added");
                } else if (globalWindow.YT && globalWindow.YT.Player) {
                    if (globalWindow.YT.loaded) {
                        initPlayer(); // API script exists but might not be ready, wait for onYouTubeIframeAPIReady
                    } else {
                        console.log("Waiting for existing API script to load...");
                        // The API script is loading, onYouTubeIframeAPIReady will be called
                    }
                }
            } else {
                console.log("YouTube API already loaded and ready");
                initPlayer();
            }
        };

        loadYouTubeAPI();

        // cleanup function
        return () => {
            if (player && typeof player.destroy === 'function') {
                player.destroy();
            }
            const globalWindow = window as any;
            if (globalWindow.onYouTubeIframeAPIReady) {
                delete globalWindow.onYouTubeIframeAPIReady;
            }
        };
    });

    // reset piece selection when composer changes
    $effect(() => {
        const currentComposerId = selectedComposer?.value;
        selectedPiece = null;
    });
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Round {round + 1} / {recordings?.length ?? 0}</h1>
        <h2 class="text-xl mb-6 text-center">Total Score: {score}</h2>

        {#if !submitted}
            <!-- Composer selection -->
            <div class="mb-4">
                <label for="composer" class="block text-sm font-medium text-gray-700 mb-1">Select Composer</label>
                <Select id="composer" items={composerOptions} bind:value={selectedComposer} placeholder="-- Select or type to filter --"></Select>
            </div>

            <!-- Piece selection -->
            <div class="mb-6">
                <label for="piece" class="block text-sm font-medium text-gray-700 mb-1">Select Piece</label>
                <Select id="piece" items={pieceOptions} bind:value={selectedPiece} placeholder="-- Select or type to filter --" disabled={!selectedComposer}></Select>
            </div>

            <!-- Submit button -->
            <div class="flex justify-center">
                <button onclick={submit}
                        disabled={!selectedComposer || !selectedPiece}
                        class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit Answer
                </button>
            </div>
        {:else}
            <!-- Score display and Next Round button -->
            <div class="text-center">
                <p class="text-lg font-semibold mb-2">Round Score:</p>
                <p class="text-4xl font-bold mb-4 text-indigo-600">{Math.round($animatedScore)}</p>

                <!-- Display Correct Answer -->
                {#if recordings?.[round]}
                    {@const correctAnswer = recordings[round]}
                    <div class="mb-6 p-4 bg-gray-100 rounded-md border border-gray-300">
                        <h3 class="text-lg font-semibold mb-2">Correct Answer:</h3>
                        <p><strong>Composer:</strong> {correctAnswer.composerName}</p>
                        <p><strong>Piece:</strong> {correctAnswer.pieceName}</p>
                        <p><strong>Artist:</strong> {correctAnswer.artistName}</p>
                        <p class="mt-2">
                            <a href="{correctAnswer.url}&t={Math.floor(startTime)}" target="_blank" rel="noopener noreferrer" 
                               class="text-blue-600 hover:text-blue-800 underline">
                                Watch on YouTube
                            </a>
                            <span class="text-gray-600 ml-2">
                                (starts at {Math.floor(startTime / 60)}:{String(Math.floor(startTime % 60)).padStart(2, '0')})
                            </span>
                        </p>
                    </div>
                {/if}

                {#if recordings && round < recordings.length - 1}
                    <button onclick={nextRound}
                            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Next Round
                    </button>
                {:else}
                    <p class="text-xl font-semibold mb-4">Game Over!</p>
                    {#if isNewBest}
                        <p class="text-2xl font-bold text-yellow-500 mb-4 animate-pulse">🎉 New Best Score! 🎉</p>
                    {/if}
                    <p class="text-lg mb-6">Your final score is {score}</p>
                    <a href="/" class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Go Home
                    </a>
                {/if}
            </div>
        {/if}
    </div>

    <!-- YouTube player container  -->
    <div id="youtube-player" class="absolute -top-[9999px] -left-[9999px]"></div>
</div> 