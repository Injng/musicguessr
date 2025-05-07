<script lang="ts">
    import type { PageData } from './$types';
    import GamePlayer from '$lib/components/GamePlayer.svelte';

    let { data }: { data: PageData } = $props();
</script>

<GamePlayer
    composers={data.composers ?? []}
    pieces={data.pieces ?? []}
    recordings={data.recordings ?? []}
    setId={data.setId ?? ''}
    isComposerSet={false}
/>