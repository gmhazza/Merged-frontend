<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['select']);

const props = defineProps({
  activeId: {
    type: [String, Number],
    default: null,
  },
});

const chats = ref([]);
const search = ref('');
const loading = ref(true);

const filteredChats = computed(() => {
  if (!search.value.trim()) return chats.value;
  const q = search.value.toLowerCase();
  return chats.value.filter((chat) => chat.username.toLowerCase().includes(q));
});

onMounted(loadChats)

async function loadChats() {
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/get/interested/approved`, {
        credentials: 'include'
      });
    if (!response.ok) throw new Error('Failed to load conversations');
    chats.value = await response.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function selectChat(chat) {
  emit('select', chat);
}

function initials(username = '') {
  return username.slice(0, 2).toUpperCase();
}

defineExpose({ loadChats });
</script>

<template>
  <div class="w-full h-full bg-white border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="px-4 py-4 border-b border-gray-100">
      <h2 class="text-lg font-bold text-gray-900 mb-3">Messages</h2>
      <div class="relative">
        <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search conversations"
          class="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>

    <!-- Conversation list -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="px-4 py-6 text-sm text-gray-400 text-center">
        Loading conversations...
      </div>

      <div v-else-if="!filteredChats.length" class="px-4 py-10 text-center">
        <p class="text-sm font-medium text-gray-700">No conversations yet</p>
        <p class="text-xs text-gray-400 mt-1">Matches you chat with will show up here.</p>
      </div>

      <button
        v-for="chat in filteredChats"
        :key="chat.id"
        @click="selectChat(chat)"
        class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50"
        :class="chat.id === activeId ? 'bg-indigo-50 hover:bg-indigo-50' : ''"
      >
        <div class="relative shrink-0">
          <div class="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
            {{ initials(chat.username) }}
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ chat.username }}</p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>