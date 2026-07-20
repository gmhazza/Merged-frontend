<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/auth/auth'
import { useRouter } from 'vue-router'
 
const auth = useAuthStore()
const router = useRouter()
 
onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
 
    if (response.ok) {
      auth.isAuthenticated = false
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(() => {
      router.replace('/login')
    }, 2000)
  }
})
</script>
 
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 text-center">
      <div class="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-5">
        <svg
          class="w-7 h-7 text-indigo-600 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
 
      <h1 class="text-lg font-bold text-gray-900 mb-1">Logging you out</h1>
      <p class="text-sm text-gray-500">Redirecting you to the login page...</p>
    </div>
  </div>
</template>