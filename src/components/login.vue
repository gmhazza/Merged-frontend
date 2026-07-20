<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/auth/auth';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');


onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/token`, {
    credentials: "include"
  });
  if(response.ok) {
    auth.isAuthenticated = true;
    router.replace('/');
  }
});

async function handleSubmit() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      if (response.ok) {
        auth.isAuthenticated = true;
        auth.user = await response.json();
        router.replace('/')
      } else {
        const message = await response.json();
      error.value = message.message;
      }
      
  } catch (error) {
    console.log(error.message);
  }
  
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p class="text-sm text-gray-500 mb-6">Log in to your account to continue.</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password <span class="text-red-500">*</span>
            </label>
            <a href="/forgot-password" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {{ loading ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <p class="text-sm text-gray-500 text-center mt-6">
        Don't have an account?
        <a href="/register" class="text-indigo-600 font-medium hover:text-indigo-700">Register</a>
      </p>
    </div>
  </div>
</template>

