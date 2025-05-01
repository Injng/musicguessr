<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    // get superform data
    const { form, message, errors, enhance: superEnhance } = superForm(data.form);
</script>

<div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
            <h1 class="text-3xl font-bold">MusicGuessr</h1>
            <p class="mt-2 text-gray-600">Login to continue</p>
        </div>
        
        {#if $message}
            <div class={`p-4 rounded-md ${$message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {$message.text}
            </div>
        {/if}
        
        <form method="POST" use:superEnhance class="mt-8 space-y-6">
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    id="username" 
                    name="username" 
                    type="email" 
                    bind:value={$form.username} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {#if $errors.username}
                    <p class="mt-1 text-sm text-red-600">{$errors.username}</p>
                {/if}
            </div>
            
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    bind:value={$form.password} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {#if $errors.password}
                    <p class="mt-1 text-sm text-red-600">{$errors.password}</p>
                {/if}
            </div>
            
            <div>
                <button 
                    type="submit" 
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign in
                </button>
            </div>
        </form>
    </div>
</div>
