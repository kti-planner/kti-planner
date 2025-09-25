<script setup lang="ts">
import { computed } from 'vue';
import type { UserData } from '@components/users/types';

const {
    id = crypto.randomUUID(),
    required = false,
    modelValue = null,
} = defineProps<{
    id?: string | undefined;
    options: UserData[];
    required?: boolean | undefined;
    modelValue?: UserData | null | undefined;
}>();

const emit = defineEmits<{
    'update:model-value': [value: UserData];
}>();

const value = computed<UserData | null>({
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
