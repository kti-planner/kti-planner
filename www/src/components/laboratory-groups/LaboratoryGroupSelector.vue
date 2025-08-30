<script setup lang="ts">
import { useId } from 'vue';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';

const model = defineModel<LaboratoryGroupData | null>({ default: null });

const { id = useId(), required = false } = defineProps<{
    id?: string | undefined;
    options: LaboratoryGroupData[];
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
