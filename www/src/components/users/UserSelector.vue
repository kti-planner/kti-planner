<script setup lang="ts">
import type { UserData } from '@components/users/types';

const model = defineModel<UserData | null>({ default: null });

const { id = crypto.randomUUID(), required = false } = defineProps<{
    id?: string | undefined;
    options: UserData[];
    required?: boolean | undefined;
}>();
</script>

<template>
    <select :id="id" v-model="model" class="form-select" :required>
        <option v-for="option in options" :key="option.id" :value="option">
            {{ option.name }}
        </option>
    </select>
</template>
