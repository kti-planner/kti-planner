<script setup lang="ts">
import type { ScheduleChangeType } from '@backend/semester';
import { langId } from '@components/frontend/lang';
import { scheduleChangeTypeLabels } from '@components/semesters/types';

const translations = {
    'en': {
        'no changes': 'no changes',
    },
    'pl': {
        'no changes': 'bez zmian',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const model = defineModel<ScheduleChangeType | null>({ required: true });

defineProps<{
    size?: 'sm' | undefined;
}>();
</script>

<template>
    <select
        v-model="model"
        class="form-select"
        :class="{
            'form-select-sm': size === 'sm',
        }"
        style="max-width: fit-content"
    >
        <option :value="null">{{ translate('no changes') }}</option>
        <option v-for="(label, type) in scheduleChangeTypeLabels[langId]" :key="type" :value="type">
            {{ label }}
        </option>
    </select>
</template>
