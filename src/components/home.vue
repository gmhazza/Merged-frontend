<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/auth/auth'
import { useRouter } from 'vue-router'

const router = useRouter();
const auth = useAuthStore();


const profiles = ref([])
const currentIndex = ref(0)
const pendingInterests = ref([])
const showNotifications = ref(false)
const dragClass = ref('')

const currentProfile = computed(() => profiles.value[currentIndex.value] || null)
const nextProfile = computed(() => profiles.value[currentIndex.value + 1] || null)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/token`, {
    credentials: 'include'
  });
  if(!response.ok) {
    router.replace('/login');
  } else {
    auth.isAuthenticated = true;
    await loadProfiles();
    await loadPendingInterests();
  }
});

watch(
  () => pendingInterests.value,
  (interests) => {

  },
  {
    immediate: true
  }
);

async function loadProfiles() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/get/all/user`, {
    credentials: 'include'
    });
    if (!response.ok) { throw new Error('Failed to load profiles'); }
    profiles.value = await response.json();
  } catch (err) {
    console.error(err);
  }
}

async function loadPendingInterests() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/get/interested/not/approved`, {
    credentials: 'include'
    });
    if (!response.ok) { throw new Error('Failed to load interests'); }
    pendingInterests.value = await response.json();
  } catch (err) {
    console.error(err);
  }
}

function initials(username = '') {
  return username
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function hasLinks(profile) {
  return profile.github || profile.linkedin || profile.portfolio;
}

function pass() {
  animateOut('translate-x-[-120%] rotate-[-8deg]');
}

async function showInterest(person, fromNotification = false) {
  try {
    if(!fromNotification) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/register/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: person.id }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to send interest');
    } else {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/show/interest`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: person.id }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('unable to update');
      pendingInterests.value = pendingInterests.value.filter((p) => p.id !== person.id);
      showNotifications.value = false;
    }
    if (!fromNotification) {
      animateOut('translate-x-[120%] rotate-[8deg]');
    }
  } catch (err) {
    console.error(err);
    if (!fromNotification) animateOut('translate-x-[120%] rotate-[8deg]');
  }
}

function animateOut(exitClass) {
  dragClass.value = exitClass + ' opacity-0';
  setTimeout(() => {
    currentIndex.value += 1;
    dragClass.value = '';
  }, 200);
}
</script>

<!--
min-h-screen
-->

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10" style="min-height: 90vh;">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">Discover</h1>
        <button
          class="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
          @click="showNotifications = !showNotifications"
          aria-label="Notifications"
        >
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
          </svg>
          <span
            v-if="pendingInterests.length"
            class="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[11px] font-semibold text-white bg-red-500 rounded-full"
          >
            {{ pendingInterests.length }}
          </span>
        </button>
      </div>

      <!-- Notifications dropdown -->
      <div v-if="showNotifications" class="mb-6 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-semibold text-gray-900">Interested in you</p>
        </div>
        <div v-if="!pendingInterests.length" class="px-4 py-6 text-sm text-gray-400 text-center">
          No new interests yet.
        </div>
        <div
          v-for="person in pendingInterests"
          :key="person.id"
          class="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-b-0"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
              {{ initials(person.username) }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ person.username }}</p>
              <p class="text-xs text-gray-500">{{ person.role }}</p>
            </div>
          </div>
          <button
            @click="showInterest(person, true)"
            class="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 transition-colors"
          >
            Show Interest
          </button>
        </div>
      </div>

      <!-- Card stack -->
      <div v-if="currentProfile" class="relative h-[560px]">
        <!-- Peek card behind -->
        <div
          v-if="nextProfile"
          class="absolute inset-0 bg-white rounded-2xl shadow-sm scale-95 translate-y-3 opacity-60"
        ></div>

        <!-- Active card -->
        <div
          class="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-200"
          :class="dragClass"
        >
          <!-- Avatar / banner -->
          <div class="h-56 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
            <div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold backdrop-blur-sm">
              {{ initials(currentProfile.username) }}
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-bold text-gray-900">{{ currentProfile.username }}</h2>
                <span class="text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full px-2 py-0.5">
                  {{ currentProfile.role }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ currentProfile.type }}
                <span v-if="currentProfile.city || currentProfile.country">
                  · {{ [currentProfile.city, currentProfile.country].filter(Boolean).join(', ') }}
                </span>
              </p>
            </div>

            <p v-if="currentProfile.bio" class="text-sm text-gray-700 leading-relaxed">
              {{ currentProfile.bio }}
            </p>

            <div v-if="hasLinks(currentProfile)" class="flex flex-wrap gap-2 pt-1">
              <a
                v-if="currentProfile.github"
                :href="currentProfile.github"
                target="_blank"
                class="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
              >
                GitHub
              </a>
              <a
                v-if="currentProfile.linkedin"
                :href="currentProfile.linkedin"
                target="_blank"
                class="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
              >
                LinkedIn
              </a>
              <a
                v-if="currentProfile.portfolio"
                :href="currentProfile.portfolio"
                target="_blank"
                class="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
              >
                Portfolio
              </a>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-center gap-6 py-5 border-t border-gray-100 shrink-0">
            <button
              @click="pass"
              class="w-14 h-14 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors"
              aria-label="Pass"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              @click="() => showInterest(currentProfile)"
              class="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center shadow-md transition-colors"
              aria-label="Show interest"
            >
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.5 6.6 4.4 5.1c2.2-1.1 4.6-.3 5.9 1.5.4.5.7 1 1.7 1s1.3-.5 1.7-1c1.3-1.8 3.7-2.6 5.9-1.5 2.9 1.5 3.4 5 1.7 7.7C18.7 16.65 12 21 12 21z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="h-[560px] flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm">
        <p class="text-gray-900 font-semibold mb-1">You're all caught up</p>
        <p class="text-sm text-gray-500">Check back later for more developers to discover.</p>
      </div>
    </div>
  </div>
</template>
