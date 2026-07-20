<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
      <div class="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-5">
        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <p class="text-5xl font-extrabold text-indigo-600 mb-2">404</p>
      <h1 class="text-lg font-bold text-gray-900 mb-1">Page not found</h1>
      <p class="text-sm text-gray-500 mb-6">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <div class="flex gap-3">
        <button
          @click="goBack"
          class="flex-1 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg py-2.5 transition-colors"
        >
          Go back
        </button>
        <button
          @click="goHome"
          class="flex-1 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 transition-colors"
        >
          Go home
        </button>
      </div>
    </div>
  </div>
</template>