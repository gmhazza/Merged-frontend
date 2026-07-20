<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChatSidebar from '@/components/chatSidebar.vue'
import ChatWindow from '@/components/chatWindow.vue'
import { useAuthStore } from '@/auth/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore();

const myId = ref(0)
const targetId = ref(route.params.targetId || null)
const targetUser = ref(null)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/database/token`, {
    credentials: 'include'
  });
  if(!response.ok) {
    router.replace('/login');
  } else {
    auth.isAuthenticated = true;
    const userToken = await response.json();
    myId.value = userToken.id;
  }
});

watch(() => route.params.targetId, (id) => {
  targetId.value = id || null
})

function goToChat(chat) {
  targetUser.value = chat
  router.push(`/chat/${chat.id}`);
}
</script>

<template>
    <div class="flex h-screen">
    <div class="w-80 shrink-0">
      <ChatSidebar :active-id="targetId" @select="goToChat" />
    </div>
    <div class="flex-1">
      <ChatWindow :target-user="targetUser" :current-user-id="myId" />
    </div>
  </div>
</template>