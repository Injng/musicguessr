<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import {signupSchema} from "./schema";

    let { data }: { data: PageData } = $props();

    // get superform data for login
    const { form: loginForm, message: loginMessage, errors: loginErrors, enhance: loginEnhance } = superForm(data.loginForm, {
        id: 'login'
    });

    // get superform data for signup
    const { form: signupForm, message: signupMessage, errors: signupErrors, enhance: signupEnhance } = superForm(data.signupForm, {
        id: 'signup',
        validators: zodClient(signupSchema),
    });
</script>

<div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
            <h1 class="text-3xl font-bold">MusicGuessr</h1>
            <p class="mt-2 text-gray-600">Login or Sign Up to continue</p>
        </div>
        
        <!-- Login Form -->
        <form method="POST" action="?/login" use:loginEnhance class="mt-8 space-y-6">
            <h2 class="text-xl font-semibold text-center">Login</h2>
            <div>
                <label for="login-username" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    id="login-username" 
                    name="username" 
                    type="email" 
                    bind:value={$loginForm.username} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-invalid={$loginErrors.username ? 'true' : undefined}
                />
                {#if $loginErrors.username}
                    <p class="mt-1 text-sm text-red-600" id="login-username-error">{$loginErrors.username}</p>
                {/if}
            </div>
            
            <div>
                <label for="login-password" class="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    id="login-password" 
                    name="password" 
                    type="password" 
                    bind:value={$loginForm.password} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-invalid={$loginErrors.password ? 'true' : undefined}
                />
                {#if $loginErrors.password}
                    <p class="mt-1 text-sm text-red-600" id="login-password-error">{$loginErrors.password}</p>
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

        <hr class="my-8 border-gray-300">

        <!-- Signup Form -->
        {#if $signupMessage}
            <div class={`p-4 rounded-md ${$signupMessage !== 'Signup successful!' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {$signupMessage === 'Signup successful!' ? 'Success! Check your email to verify your account.' : $signupMessage}
            </div>
        {/if}

        <form method="POST" action="?/signup" use:signupEnhance class="mt-8 space-y-6">
             <h2 class="text-xl font-semibold text-center">Sign Up</h2>
            <div>
                <label for="signup-username" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    id="signup-username" 
                    name="username" 
                    type="email" 
                    bind:value={$signupForm.username} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-invalid={$signupErrors.username ? 'true' : undefined}
                />
                {#if $signupErrors.username}
                    <p class="mt-1 text-sm text-red-600" id="signup-username-error">{$signupErrors.username}</p>
                {/if}
            </div>

             <div>
                <label for="signup-displayName" class="block text-sm font-medium text-gray-700">Display Name</label>
                <input 
                    id="signup-displayName" 
                    name="displayName" 
                    type="text" 
                    bind:value={$signupForm.displayName} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-invalid={$signupErrors.displayName ? 'true' : undefined}
                />
                {#if $signupErrors.displayName}
                    <p class="mt-1 text-sm text-red-600" id="signup-displayName-error">{$signupErrors.displayName}</p>
                {/if}
            </div>
            
            <div>
                <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    id="signup-password" 
                    name="password" 
                    type="password" 
                    bind:value={$signupForm.password} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-invalid={$signupErrors.password ? 'true' : undefined}
                />
                {#if $signupErrors.password}
                    <p class="mt-1 text-sm text-red-600" id="signup-password-error">{$signupErrors.password}</p>
                {/if}
            </div>

             <div>
                <label for="signup-confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input 
                    id="signup-confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    bind:value={$signupForm.confirmPassword} 
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    aria-invalid={$signupErrors.confirmPassword ? 'true' : undefined}
                />
                {#if $signupErrors.confirmPassword}
                    <p class="mt-1 text-sm text-red-600" id="signup-confirmPassword-error">{$signupErrors.confirmPassword}</p>
                {/if}
            </div>
            
            <div>
                <button 
                    type="submit" 
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Sign up
                </button>
            </div>
        </form>
    </div>
</div>
