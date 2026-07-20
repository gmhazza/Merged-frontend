<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '@/auth/auth';
import { useRouter } from 'vue-router';


const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  username: '',
  email: '',
  password: '',
  gender: '',
  type: '',
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
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form),
    credentials: 'include'
  });
  if(response.ok) {
    auth.isAuthenticated = true;
    router.replace('/');
  } else {
      const message = await response.json();
      error.value = message.message;
  }
}
</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
      <p class="text-sm text-gray-500 mb-6">Fill in the details below to register.</p>
 
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          <!-- Left column -->
          <div class="space-y-5">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                placeholder="John Doe"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
 
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
 
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="8"
                placeholder="At least 8 characters"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
 
          <!-- Right column -->
          <div class="space-y-5">
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
                Gender <span class="text-red-500">*</span>
              </label>
              <select
                id="gender"
                v-model="form.gender"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
 
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
                Role <span class="text-red-500">*</span>
              </label>
              <select
                id="role"
                v-model="form.role"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>Select a role</option>
                <option value="web developer">Web Developer</option>
                <option value="app developer">App Developer</option>
                <option value="game developer">Game Developer</option>
                <option value="software developer">Software Developer</option>
                <option value="ui/ux designer">UI/UX Designer</option>
                <option value="graphic designer">Graphic Designer</option>
                <option value="video editor">Video Editor</option>
                <option value="pr specialist">PR Specialist</option>
                <option value="seo specialist">SEO Specialist</option>
              </select>
            </div>
          </div>
        </div>
 
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
 
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>
