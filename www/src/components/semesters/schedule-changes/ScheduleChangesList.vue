<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleChangeType } from '@backend/semester';
import { langId } from '@components/frontend/lang';
import { scheduleChangeTypeLabels } from '@components/semesters/types';
import { parseDateLocalYyyyMmDd } from '@components/utils';
import IconButton from '@components/IconButton.vue';
import ScheduleChangeTypeSelector from '@components/semesters/schedule-changes/ScheduleChangeTypeSelector.vue';

const translations = {
    'en': {
        'Edit': 'Edit',
        'Remove': 'Remove',
        'Save': 'Save',
    },
    'pl': {
        'Edit': 'Edytuj',
        'Remove': 'Usuń',
        'Save': 'Zapisz',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const scheduleChanges = defineModel<Map<string, ScheduleChangeType>>({ required: true });
const editableFields = defineModel<Set<string>>('editableFields', { required: true });

const sortedScheduleChanges = computed(() =>
    [...scheduleChanges.value.entries()].toSorted((a, b) => a[0].localeCompare(b[0])),
);
</script>

<template>
    <ul v-if="sortedScheduleChanges.length > 0" class="list-group mx-auto my-3" style="max-width: 500px">
        <li v-for="[date, type] in sortedScheduleChanges" :key="date" class="list-group-item hstack">
            {{ parseDateLocalYyyyMmDd(date).toLocaleDateString('pl-PL') }} -
            <ScheduleChangeTypeSelector
                v-if="editableFields.has(date)"
                :model-value="type"
                size="sm"
                class="ms-1 ps-1 py-0"
                @update:model-value="
                    newType => (newType ? scheduleChanges.set(date, newType) : scheduleChanges.delete(date))
                "
            />
            <template v-else>
                {{ scheduleChangeTypeLabels[langId][type] }}
            </template>
            <IconButton
                v-if="editableFields.has(date)"
                icon="check-lg"
                :aria-label="translate('Save')"
                class="ms-auto"
                :title="translate('Save')"
                @click="editableFields.delete(date)"
            />
            <IconButton
                v-else
                icon="pencil"
                :aria-label="translate('Edit')"
                class="ms-auto"
                :title="translate('Edit')"
                @click="editableFields.add(date)"
            />
            <IconButton
                icon="trash"
                :aria-label="translate('Remove')"
                class="text-danger ms-2"
                :title="translate('Remove')"
                @click="scheduleChanges.delete(date)"
            />
        </li>
    </ul>
</template>
