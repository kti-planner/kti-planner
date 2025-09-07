<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { ScheduleChangeType } from '@backend/semester';
import { langId } from '@components/frontend/lang';
import { apiPut } from '@components/api';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDd, parseDateLocalYyyyMmDd } from '@components/utils';
import ScheduleChangesCalendar from '@components/semesters/schedule-changes/ScheduleChangesCalendar.vue';
import ScheduleChangeTypeSelector from '@components/semesters/schedule-changes/ScheduleChangeTypeSelector.vue';

const translations = {
    'en': {
        'Set': 'Set',
        'Save': 'Save',
        'Saved': 'Saved',
    },
    'pl': {
        'Set': 'Ustaw',
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

const preventPageUnload = ref<boolean>(false);
const changesSaved = ref<boolean>(false);

const newScheduleChangeDate = ref<string>('');
const newScheduleChangeDateEnd = ref<string>('');
const newScheduleChangeType = ref<ScheduleChangeType | null>(null);

function addScheduleChange() {
    if (newScheduleChangeDate.value === '') {
        return;
    }

    if (newScheduleChangeDateEnd.value === '') {
        if (newScheduleChangeType.value) {
            scheduleChanges.value.set(newScheduleChangeDate.value, newScheduleChangeType.value);
        } else {
            scheduleChanges.value.delete(newScheduleChangeDate.value);
        }
    } else {
        const start = parseDateLocalYyyyMmDd(newScheduleChangeDate.value);
        const end = parseDateLocalYyyyMmDd(newScheduleChangeDateEnd.value);

        while (start.getTime() <= end.getTime()) {
            if (newScheduleChangeType.value) {
                scheduleChanges.value.set(formatDateLocalYyyyMmDd(start), newScheduleChangeType.value);
            } else {
                scheduleChanges.value.delete(formatDateLocalYyyyMmDd(start));
            }

            start.setDate(start.getDate() + 1);
        }
    }

    window.getSelection()?.empty();
    newScheduleChangeDate.value = '';
    newScheduleChangeDateEnd.value = '';
}

async function save() {
    await apiPut(
        `/semesters/${semester.slug}/api/schedule-changes/`,
        [...scheduleChanges.value.entries()].map(([date, type]) => ({ date, type })) satisfies ScheduleChangeData[],
    );

    preventPageUnload.value = false;
    changesSaved.value = true;
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
    <div class="mx-auto my-3">
        <ScheduleChangesCalendar
            :semester
            :schedule-changes
            class="mx-auto my-3"
            @select="
                (startDate, endDate) => {
                    newScheduleChangeDate = formatDateLocalYyyyMmDd(startDate);
                    newScheduleChangeDateEnd = formatDateLocalYyyyMmDd(endDate);
                }
            "
        />
        <div class="input-group justify-content-center my-3">
            <input
                v-model="newScheduleChangeDate"
                type="date"
                :min="semester.startDate"
                :max="semester.endDate"
                class="form-control"
                style="max-width: fit-content"
            />
            <span class="input-group-text">-</span>
            <input
                v-model="newScheduleChangeDateEnd"
                type="date"
                :min="semester.startDate"
                :max="semester.endDate"
                :placeholder="newScheduleChangeDate"
                class="form-control"
                style="max-width: fit-content"
            />
            <ScheduleChangeTypeSelector v-model="newScheduleChangeType" />
            <button
                type="button"
                class="btn btn-success"
                :disabled="newScheduleChangeDate === ''"
                @click="addScheduleChange()"
            >
                {{ translate('Set') }}
            </button>
        </div>
        <button type="button" class="btn btn-success d-block mx-auto" @click="save()">
            {{ translate('Save') }}
        </button>
        <div v-if="changesSaved" class="text-center mt-2">{{ translate('Saved') }}!</div>
    </div>
</template>
