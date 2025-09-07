<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { UserData } from '@components/users/types';

const model = defineModel<UserData[]>('selected', { default: [] });

const { users } = defineProps<{
    users: UserData[];
}>();

const selectedUserIds = ref(new Set<string>());

watchEffect(() => {
    model.value = users.filter(group => selectedUserIds.value.has(group.id));
});
</script>

<template>
    <div v-if="users && users.length > 0" class="d-flex flex-wrap gap-2">
        <template v-for="user in users" :key="user.id">
            <input
                :id="user.id"
                v-model="selectedUserIds"
                :value="user.id"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
            />
            <label
                class="btn group-btn"
                :class="selectedUserIds.has(user.id) ? 'btn-success' : 'btn-light'"
                :for="user.id"
            >
                {{ user.name }}
            </label>
        </template>
    </div>
</template>

<style scoped lang="scss">
.group-btn:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}
</style>
