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
        'The class does not fit in the semester': 'The class does not fit in the semester',
        'Conflict with canceled classes schedule': 'Conflict with canceled classes schedule',
    },
    'pl': {
        'Unknown [teacher]': 'Nieznany',
        'This is a holiday': 'To jest dzień wolny',
        'There is another class in this classroom during this time':
            'W tym samym czasie w tej sali odbywają się inne zajęcia',
        'The class does not fit in the semester': 'Ćwiczenie nie mieści się w semestrze',
        'Conflict with canceled classes schedule': 'Konflikt z godzinami odwołanych zajęć',
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

const conflictTextClass = computed(() => {
    if (!conflict.value) {
        return '';
    }

    return conflict.value.type === 'classes-canceled' ? 'text-warning' : 'text-danger';
});
</script>

<template>
    <div
        class="card"
        :class="{
            'border-warning': conflict?.type === 'classes-canceled',
            'border-danger': conflict && conflict.type !== 'classes-canceled',
        }"
    >
        <div class="card-body">
            <h3 class="card-title fs-6" :class="conflictTextClass">
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
            <p v-if="conflict" class="mt-2 mb-0" :class="conflictTextClass">
                {{
                    conflict.type === 'holiday'
                        ? translate('This is a holiday')
                        : conflict.type === 'outside-of-semester'
                          ? translate('The class does not fit in the semester')
                          : conflict.type === 'classes-canceled'
                            ? translate('Conflict with canceled classes schedule')
                            : translate('There is another class in this classroom during this time')
                }}
            </p>
        </div>
    </div>
</template>
