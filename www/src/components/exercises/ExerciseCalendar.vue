<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import { useApiFetch } from '@components/api';
import { getInitialDate, getLaboratoryClassEvents, getScheduleChangeEvents } from '@components/calendar/events';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import Calendar from '@components/Calendar.vue';
import LaboratoryClassEditModals from '@components/laboratory-classes/LaboratoryClassEditModals.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';

const { exercise, semester, subject, scheduleChanges } = defineProps<{
    exercise: ExerciseData;
    semester: SemesterData;
    subject: SubjectData;
    teachers: UserPublicData[];
    scheduleChanges: ScheduleChangeData[];
}>();

const apiUrl = computed(() => `/semesters/${semester.slug}/subjects/${subject.slug}/api/laboratory-classes/`);

const { data: laboratoryClasses, execute: refreshClasses } = useApiFetch<LaboratoryClassData[]>(
    apiUrl,
    () => new URLSearchParams({ exercise: exercise.id }),
);

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? [], [subject]),
    ...getScheduleChangeEvents(scheduleChanges),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));

const editModal = useTemplateRef('editModal');
const editedLaboratoryClass = shallowRef<LaboratoryClassData | null>(null);

function handleEventClick(arg: EventClickArg) {
    if (!('laboratoryClass' in arg.event.extendedProps)) {
        return;
    }

    editedLaboratoryClass.value = arg.event.extendedProps.laboratoryClass;
    editModal.value?.classDetailsModal?.show();
}
</script>

<template>
    <Calendar :events :initial-date initial-view="listYear" @event-click="handleEventClick">
        <template #eventContent="arg">
            <LaboratoryClassEvent
                v-if="'laboratoryClass' in arg.event.extendedProps"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
                hide-exercise-name
            />
        </template>
    </Calendar>

    <LaboratoryClassEditModals
        ref="editModal"
        :laboratory-class="editedLaboratoryClass"
        :subject
        :teachers
        :semester
        show-subject
        @submit="refreshClasses"
    />
</template>
