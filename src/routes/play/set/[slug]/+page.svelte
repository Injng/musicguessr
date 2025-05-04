<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { invalidateAll } from '$app/navigation';

    let { data }: { data: PageData } = $props();

    // keep track of the rounds the user is on
    let round = $state(0);
    let score = $state(0);
    let startTime = 0;
    let totalDuration = 0;
    let player: any;
    let submitted = $state(false);
    let currentScore = $state(0);

    // Animated score
    const animatedScore = tweened(0, {
        duration: 1000, // Animation duration in ms
        easing: cubicOut
    });

    // user answers
    let selectedComposerId: number | null = $state(null);
    let selectedCatalog: string = $state("");

    /**
     * Handle and check the user's answer
     */
    async function submit() {
        if (player) {
            player.pauseVideo(); // Pause the video on submit
        }
        // calculate how long the audio has played
        let currentPlaytime = player.getCurrentTime() - startTime;

        // build the request body and fetch the result
        let body = JSON.stringify({
            recordingId: data.recordings[round].id,
            composerAnswer: selectedComposerId,
            catalogAnswer: selectedCatalog
        })
        let response = await fetch('/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body,
        })
        let result = await response.json(); // Changed variable name from isCorrect to result

        // calculate the score based on correctness and time
        const timeFactor = Math.max(0, (1 - (currentPlaytime / totalDuration))); // Ensure timeFactor is not negative
        let calculatedScore = 0;
        if (result.success) {
            // both correct: Full points scaled by time
            calculatedScore = timeFactor * 5000;
        } else if (result.isComposerCorrect || result.isCatalogCorrect) {
            // partially correct: Partial points (e.g., 1500 max) scaled by time
            calculatedScore = timeFactor * 1500;
        } else {
            // both incorrect: 0 points
            calculatedScore = 0;
        }
        // ensure score is not negative and round it
        currentScore = Math.max(0, Math.round(calculatedScore));
        score += currentScore; // Add to total score
        submitted = true;
        animatedScore.set(currentScore); // Start the animation
    }

    /**
     * Proceed to the next round
     */
    function nextRound() {
        if (round < data.recordings.length - 1) {
            // update all the state variables
            round += 1;
            submitted = false;
            selectedComposerId = null;
            selectedCatalog = "";
            currentScore = 0;
            animatedScore.set(0, { duration: 0 });

            // destroy the current player instance and reinitialize
            if (player && typeof player.destroy === 'function') {
                player.destroy();
            }
            initPlayer();
        } else {
            console.log("Game Over! Final Score:", score);
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
        player = new YT.Player('youtube-player', {
            height: '0', // Keep hidden
            width: '0',  // Keep hidden
            videoId: extractId(data.recordings[round].url),
            playerVars: {
                autoplay: 0,
                controls: 0 // Hide controls initially
            },
            events: {
                onReady: onPlayerReady,
            }
        });
    }

    function onPlayerReady(event: any) {
        const duration = player.getDuration();
        totalDuration = duration;
        const buffer = Math.min(30, duration / 2);
        const maxStartTime = Math.max(0, duration - buffer);
        startTime = Math.floor(Math.random() * maxStartTime);
        player.seekTo(startTime, true);
        player.playVideo();
    }

    onMount(() => {
        invalidateAll();

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
                         initPlayer();
                     } else {
                         console.log("Waiting for existing API script to load...");
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
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Round {round + 1} / {data.recordings.length}</h1>
        <h2 class="text-xl mb-6 text-center">Total Score: {score}</h2>

        {#if !submitted}
            <!-- Composer selection -->
            <div class="mb-4">
                <label for="composer" class="block text-sm font-medium text-gray-700 mb-1">Select Composer</label>
                <select id="composer" bind:value={selectedComposerId} class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                    <option value={null}>-- Select a composer --</option>
                    {#each data.composers as composer}
                        <option value={composer.id}>{composer.name}</option>
                    {/each}
                </select>
            </div>

            <!-- Catalog number input -->
            <div class="mb-6">
                <label for="catalog" class="block text-sm font-medium text-gray-700 mb-1">Catalog Number</label>
                <input type="text" id="catalog" bind:value={selectedCatalog} placeholder="e.g., K. 525" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            <!-- Submit button -->
            <div class="flex justify-center">
                <button onclick={submit}
                        disabled={!selectedComposerId || !selectedCatalog.trim()}
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
                <div class="mb-6 p-4 bg-gray-100 rounded-md border border-gray-300">
                    <h3 class="text-lg font-semibold mb-2">Correct Answer:</h3>
                    <p><strong>Composer:</strong> {data.recordings[round].composerName}</p>
                    <p><strong>Piece:</strong> {data.recordings[round].pieceName}</p>
                    <p><strong>Catalog:</strong> {data.recordings[round].catalogNumber}</p>
                    <p><strong>Artist:</strong> {data.recordings[round].artistName}</p>
                </div>

                 {#if round < data.recordings.length - 1}
                    <button onclick={nextRound}
                            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Next Round
                    </button>
                 {:else}
                     <p class="text-xl font-semibold mb-4">Game Over!</p>
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