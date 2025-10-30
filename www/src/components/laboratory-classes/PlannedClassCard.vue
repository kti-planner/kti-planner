<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import type { EventConflict } from '@components/calendar/types';
import { formatClassroomName } from '@components/classrooms/types';
import { formatDateLocalHhMm, formatDateLocalYyyyMmDd, formatDateLocalYyyyMmDdHhMm } from '@components/utils';
import type { PlannedClass } from '@components/laboratory-classes/GenerateClassesForm.vue';

const translations = {
    'en': {
        'Unknown [teacher]': 'Unknown',
        'This is a holiday': 'This is a holiday',
        'There is another class in this classroom during this time':
            'There is another class in this classroom during this time',
    },
    'pl': {
        'Unknown [teacher]': 'Nieznany',
        'This is a holiday': 'To jest dzień wolny',
        'There is another class in this classroom during this time':
            'W tym samym czasie w tej sali odbywają się inne zajęcia',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { plannedClass, conflicts } = defineProps<{
    plannedClass: PlannedClass;
    conflicts: EventConflict[];
}>();

const conflict = computed<EventConflict | null>(
    () =>
        conflicts.find(
            conflict =>
                formatDateLocalYyyyMmDdHhMm(plannedClass.start) === conflict.startDate &&
                formatDateLocalYyyyMmDdHhMm(plannedClass.end) === conflict.endDate,
        ) ?? null,
);
</script>

<template>
    <div class="card" :class="{ 'border-danger': conflict }">
        <div class="card-body">
            <h3 class="card-title fs-6" :class="{ 'text-danger': conflict }">
                {{ `${plannedClass.exercise.exerciseNumber}. ${plannedClass.exercise.name}` }}
            </h3>
            <h4 class="card-subtitle mb-2 text-body-secondary fs-6">
                {{
                    `${formatDateLocalYyyyMmDd(plannedClass.start)} ${formatDateLocalHhMm(plannedClass.start)} - ${formatDateLocalHhMm(plannedClass.end)}`
                }}
            </h4>
            <div>
                <i class="bi bi-person-fill"></i>
                <span class="ms-1">{{ plannedClass.exercise.teacher?.name ?? translate('Unknown [teacher]') }}</span>
            </div>
            <div>
                <i class="bi bi-building-fill"></i>
                <span class="ms-1">{{ formatClassroomName(plannedClass.exercise.classroom, langId) }}</span>
            </div>
            <p v-if="conflict" class="text-danger mt-2 mb-0">
                {{
                    conflict.type === 'holiday'
                        ? translate('This is a holiday')
                        : translate('There is another class in this classroom during this time')
                }}
            </p>
        </div>
    </div>
</template>
