<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/auth/auth'

const auth = useAuthStore()
const mobileOpen = ref(false)

const links = [
  { label: 'Find', href: '/' },
  { label: 'Chat', href: '/chat' },
  { label: 'Profile', href: '/profile' },
]
</script>

<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo / Brand -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-16 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            <img src="/256.ico" alt="logo" class="w-full h-full object-cover"/>
          </div>
          <span class="text-lg font-semibold text-gray-900">Merged</span>
        </RouterLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-8" v-if="auth.isAuthenticated">
          <RouterLink
            v-for="link in links"
            :key="link.label"
            :to="link.href"
            class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Desktop actions -->
        <div class="hidden md:flex items-center gap-3" v-if='!auth.isAuthenticated'>
          <RouterLink
            to="/login"
            class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Log in
          </RouterLink>
          <RouterLink
            to="/register"
            class="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-colors"
          >
            Register
          </RouterLink>
        </div>
        <div class="pt-2 flex flex-col gap-2" v-if='auth.isAuthenticated'>
        <RouterLink
          to="/logout"
          class="text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-center transition-colors"
        >
          Log out
        </RouterLink>
      </div>

        <!-- Mobile menu button -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-200 px-4 py-3 space-y-1">
      <RouterLink
        v-for="link in links"
        :key="link.label"
        :to="link.href"
        class="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2"
      >
        {{ link.label }}
      </RouterLink>
      <div class="pt-2 flex flex-col gap-2" v-if='!auth.isAuthenticated'>
        <RouterLink
          to="/login"
          class="text-sm font-medium text-gray-600 hover:text-indigo-600 py-2"
        >
          Log in
        </RouterLink>
        <RouterLink
          to="/register"
          class="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-center transition-colors"
        >
          Register
        </RouterLink>
      </div>
      <div class="pt-2 flex flex-col gap-2" v-if='auth.isAuthenticated'>
        <RouterLink
          to="/register"
          class="text-sm font-medium bg-red-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-center transition-colors"
        >
          Log out
        </RouterLink>
      </div>
    </div>
  </nav>
</template>