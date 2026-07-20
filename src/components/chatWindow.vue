<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { socket } from '@/websockets/socketio';

const props = defineProps({
  targetUser: {
    type: Object,
    default: null,
  },
  currentUserId: {
    type: [String, Number],
    required: true,
  },
});


const messages = ref([]);
const chatId = ref(null);
const roomId = ref(null);
const targetRoomId = ref(null)
const draft = ref('');
const loading = ref(false);
const sending = ref(false);
const scrollContainer = ref(null);


watch(
  () => props.targetUser,
  async (user) => {
    if (!user) {
      messages.value = [];
      chatId.value = null;
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/get/chat/id`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ targetId: user.id }),
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get or create chatId');
      }

      const res = await response.json();
      chatId.value = res.id;
      await loadMessages(user.id);
      const response1 = await fetch(`${import.meta.env.VITE_BACKEND_API}/chat/room`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ targetId: user.id, roomId: roomId.value }),
          credentials: 'include'
      });
      if(response1.ok) {
        const prams = await response1.json();
        if (prams) {
          targetRoomId.value = prams.roomId;
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

onMounted(() => {
  socket.connect();
  socket.on('connect', () => {
    roomId.value = socket.id;
    socket.on('get-message', (data) => {
      if (data.chatId === chatId.value) {
        messages.value.push(data);
      }
    })
  });
});

onUnmounted(() => {
    socket.off("connect");
    socket.off("get-message");
});

async function loadMessages(targetId) {
  loading.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/get/all/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId: chatId.value }),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to load messages');
    messages.value = await response.json();
    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function sendMessage() {
  const text = draft.value.trim();
  if (!text || !props.targetUser) return;

  sending.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/send/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, chatId: chatId.value, sender: props.currentUserId}),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to send message');
    const data = {message: text, chatId: chatId.value};
    socket.emit('send-message', data);
    const saved = await response.json();
    messages.value.push(saved);
    draft.value = '';

    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error(err);
  } finally {
    sending.value = false;
  }
}

function scrollToBottom() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
}

function initials(username = '') {
  return username.slice(0, 2).toUpperCase();
}
</script>


<template>
  <div class="w-full h-full bg-gray-50 flex flex-col">
    <!-- No conversation selected -->
    <div v-if="!targetUser" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <p class="text-sm font-medium text-gray-700">Select a conversation</p>
        <p class="text-xs text-gray-400 mt-1">Pick someone from the left to start chatting.</p>
      </div>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-center gap-3 px-5 py-4 bg-white border-b border-gray-200 shrink-0">
        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
          {{ initials(targetUser.username) }}
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ targetUser.username }}</p>
          <p v-if="targetUser.role" class="text-xs text-gray-500">{{ targetUser.role }}</p>
        </div>
      </div>

      <!-- Messages -->
      <div ref="scrollContainer" class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <div v-if="loading" class="text-sm text-gray-400 text-center py-6">
          Loading messages...
        </div>

        <div v-else-if="!messages.length" class="text-sm text-gray-400 text-center py-6">
          No messages yet
        </div>

        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.sender === currentUserId ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
            :class="message.sender === currentUserId
              ? 'bg-indigo-600 text-white rounded-br-sm'
              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'"
          >
            <p class="whitespace-pre-wrap break-words">{{ message.message }}</p>
          </div>
        </div>
      </div>

      <!-- Composer -->
      <form @submit.prevent="sendMessage" class="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200 shrink-0">
        <input
          v-model="draft"
          type="text"
          placeholder="Type a message"
          class="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          :disabled="!draft.trim() || sending || !chatId"
          class="w-10 h-10 shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          aria-label="Send message"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </form>
    </template>
  </div>
</template>
