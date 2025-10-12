<script setup lang="ts">
import { ref, watch } from 'vue';
import type { UserPublicData } from '@components/users/types';
import IconButton from '@components/IconButton.vue';
import UserSelector from '@components/users/UserSelector.vue';

const model = defineModel<UserPublicData[]>({ default: [] });

defineProps<{
    id?: string | undefined;
    options: UserPublicData[];
    required?: boolean | undefined;
}>();

const newSelection = ref<UserPublicData | null>(null);

watch(newSelection, () => {
    if (newSelection.value !== null) {
        if (!model.value.find(user => user.id === newSelection.value?.id)) {
            model.value.push(newSelection.value);
        }

        newSelection.value = null;
    }
});
</script>

<template>
    <ul>
        <li v-for="(user, index) in model" :key="user.id">
            {{ user.name }}
            <IconButton icon="trash" class="text-danger ms-1" @click="model.splice(index, 1)" />
        </li>
    </ul>
    <UserSelector :id v-model="newSelection" :options :required="required && model.length === 0" />
</template>
