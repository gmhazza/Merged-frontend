import { ref,  reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false);
    return {
        isAuthenticated,
    };
})