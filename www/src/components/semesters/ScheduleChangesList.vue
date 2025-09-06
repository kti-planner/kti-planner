<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { ScheduleChangeType } from '@backend/semester';
import { langId } from '@components/frontend/lang';
import { apiPut } from '@components/api';
import { type ScheduleChangeData, scheduleChangeTypeLabels, type SemesterData } from '@components/semesters/types';
import { parseDateLocalYyyyMmDd } from '@components/utils';
import IconButton from '@components/IconButton.vue';
import ScheduleChangeTypeSelector from '@components/semesters/ScheduleChangeTypeSelector.vue';

const translations = {
    'en': {
        'Edit': 'Edit',
        'Remove': 'Remove',
        'Add': 'Add',
        'Save': 'Save',
        'Saved': 'Saved',
    },
    'pl': {
        'Edit': 'Edytuj',
        'Remove': 'Usuń',
        'Add': 'Dodaj',
        'Save': 'Zapisz',
        'Saved': 'Zapisano',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { semester, initialScheduleChanges } = defineProps<{
    semester: SemesterData;
    initialScheduleChanges: readonly ScheduleChangeData[];
}>();

const scheduleChanges = ref(
    new Map<string, ScheduleChangeType>(initialScheduleChanges.map(change => [change.date, change.type])),
);

const newScheduleChangeDate = ref<string>('');
const newScheduleChangeType = ref<ScheduleChangeType>('holiday');

const editableFields = ref(new Set<string>());

const preventPageUnload = ref<boolean>(false);
const changesSaved = ref<boolean>(false);

function addScheduleChange() {
    if (newScheduleChangeDate.value === '') {
        return;
    }

    scheduleChanges.value.set(newScheduleChangeDate.value, newScheduleChangeType.value);
}

const sortedScheduleChanges = computed(() =>
    [...scheduleChanges.value.entries()].toSorted((a, b) => a[0].localeCompare(b[0])),
);

async function save() {
    await apiPut(
        `/semesters/${semester.slug}/api/schedule-changes/`,
        sortedScheduleChanges.value.map(([date, type]) => ({ date, type })) satisfies ScheduleChangeData[],
    );

    preventPageUnload.value = false;
    changesSaved.value = true;
    editableFields.value.clear();
}

watch(
    scheduleChanges,
    () => {
        preventPageUnload.value = true;
        changesSaved.value = false;
    },
    { deep: true },
);

useEventListener(
    () => (preventPageUnload.value ? window : null),
    'beforeunload',
    event => {
        event.preventDefault();
    },
);
</script>

<template>
    <div class="mx-auto my-3" style="max-width: 600px">
        <ul v-if="sortedScheduleChanges.length > 0" class="list-group mx-auto my-3" style="max-width: 500px">
            <li v-for="[date, type] in sortedScheduleChanges" :key="date" class="list-group-item hstack">
                {{ parseDateLocalYyyyMmDd(date).toLocaleDateString('pl-PL') }} -
                <ScheduleChangeTypeSelector
                    v-if="editableFields.has(date)"
                    :model-value="type"
                    size="sm"
                    class="ms-1 ps-1 py-0"
                    @update:model-value="newType => scheduleChanges.set(date, newType)"
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
        <form class="input-group my-3" @submit.prevent="addScheduleChange()">
            <input
                v-model="newScheduleChangeDate"
                type="date"
                :min="semester.startDate"
                :max="semester.endDate"
                class="form-control"
            />
            <ScheduleChangeTypeSelector v-model="newScheduleChangeType" />
            <button type="submit" class="btn btn-success" :disabled="newScheduleChangeDate === ''">
                {{ translate('Add') }}
            </button>
        </form>
        <button type="button" class="btn btn-success d-block mx-auto" @click="save()">
            {{ translate('Save') }}
        </button>
        <div v-if="changesSaved" class="text-center mt-2">{{ translate('Saved') }}!</div>
    </div>
</template>
