<script setup lang="ts">
import { computed } from 'vue';
import type { UserPublicData } from '@components/users/types';

const {
    id = crypto.randomUUID(),
    required = false,
    modelValue = null,
} = defineProps<{
    id?: string | undefined;
    options: UserPublicData[];
    required?: boolean | undefined;
    modelValue?: UserPublicData | null | undefined;
}>();

const emit = defineEmits<{
    'update:model-value': [value: UserPublicData];
}>();

const value = computed<UserPublicData | null>({
    get() {
        return modelValue;
    },
    set(newValue) {
        if (newValue) {
            emit('update:model-value', newValue);
        }
    },
});
</script>

<template>
    <select :id="id" v-model="value" class="form-select" :required>
        <option v-for="option in options" :key="option.id" :value="option">
            {{ option.name }}
        </option>
    </select>
</template>
