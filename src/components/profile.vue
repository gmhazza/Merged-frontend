<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/auth/auth'
import { useRouter } from 'vue-router'

const router = useRouter();
const auth = useAuthStore();

const blankForm = () => ({
  username: '',
  password: '',
  gender: '',
  bio: '',
  role: '',
  city: '',
  country: '',
  github: '',
  linkedin: '',
  portfolio: '',
})

const form = reactive(blankForm())
const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/profile`, {
    credentials: 'include'
  });
  if(!response.ok) {
    router.replace('/login')
  } else {
    const data = await response.json();
    Object.assign(form, blankForm(), data);
  }
})

function resetForm() {
}

async function handleSubmit() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const payload = { ...form }
    if (!payload.password) delete payload.password;
 
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/update/user`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
 
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to update profile')
    }
 
    //originalData.value = { ...form, password: '' }
    form.password = ''
    success.value = true
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
}

</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4 py-12">
    <div class="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Edit profile</h1>
      <p class="text-sm text-gray-500 mb-6">Update your account details below.</p>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Account -->
        <section class="space-y-5">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Account</h2>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Userame <span class="text-red-500">*</span>
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Leave blank to keep current password"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </section>

        <!-- About -->
        <section class="space-y-5">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">About</h2>

          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="bio"
              v-model="form.bio"
              rows="4"
              placeholder="Tell us a bit about yourself"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              id="type"
              v-model="form.role"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
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
        </section>

        <!-- Location -->
        <section class="space-y-5">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Location</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                id="country"
                v-model="form.country"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        <!-- Links -->
        <section class="space-y-5">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Links</h2>

          <div>
            <label for="github_url" class="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input
              id="github"
              v-model="form.github"
              type="url"
              placeholder="https://github.com/username"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="linkedin_url" class="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              id="linkedin"
              v-model="form.linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="portfolio_url" class="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
            <input
              id="portfolio"
              v-model="form.portfolio"
              type="url"
              placeholder="https://yourwebsite.com"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </section>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <p v-if="success" class="text-sm text-green-600">Profile updated successfully.</p>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
          >
            {{ loading ? 'Saving...' : 'Save changes' }}
          </button>
          <button
            @click.prevent='handleDelete'
            class="bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
          >
            Delete Profile
          </button>
          <button
            type="button"
            @click="resetForm"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 px-5 py-2.5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
