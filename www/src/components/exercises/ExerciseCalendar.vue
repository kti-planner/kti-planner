<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import { useApiFetch } from '@components/api';
import {
    getCalendarEvents,
    getInitialDate,
    getLaboratoryClassEvents,
    getScheduleChangeEvents,
} from '@components/calendar/events';
import type { CalendarEventData } from '@components/calendar-events/types';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import Calendar from '@components/Calendar.vue';
import CalendarEvent from '@components/calendar-events/CalendarEvent.vue';
import CalendarEventModal from '@components/calendar-events/CalendarEventModal.vue';
import LaboratoryClassEditModals from '@components/laboratory-classes/LaboratoryClassEditModals.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';

const { exercise, semester, subject, scheduleChanges } = defineProps<{
    exercise: ExerciseData;
    semester: SemesterData;
    subject: SubjectData;
    scheduleChanges: ScheduleChangeData[];
    classrooms: ClassroomData[];
    allUsers: UserPublicData[];
}>();

const { data: laboratoryClasses, execute: refreshClasses } = useApiFetch<LaboratoryClassData[]>(
    () => `/api/subjects/${subject.id}/laboratory-classes/`,
    () => new URLSearchParams({ exercise: exercise.id }),
);

const { data: calendarEvents, execute: refreshCalendarEvents } = useApiFetch<CalendarEventData[]>(
    `/api/semesters/${semester.id}/calendar-events/`,
    () => new URLSearchParams([['type', 'classes-canceled']]),
);

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? [], [subject]),
    ...getScheduleChangeEvents(scheduleChanges),
    ...getCalendarEvents(calendarEvents.value ?? []),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));

const classEditModals = useTemplateRef('classEditModals');
const editedLaboratoryClass = shallowRef<LaboratoryClassData | null>(null);

const calendarEventModal = useTemplateRef('calendarEventModal');
const clickedCalendarEvent = shallowRef<CalendarEventData | null>(null);

function handleEventClick(arg: EventClickArg) {
    if ('laboratoryClass' in arg.event.extendedProps) {
        editedLaboratoryClass.value = arg.event.extendedProps.laboratoryClass;
        classEditModals.value?.classDetailsModal?.show();
    }

    if ('calendarEvent' in arg.event.extendedProps) {
        clickedCalendarEvent.value = arg.event.extendedProps.calendarEvent;
        calendarEventModal.value?.calendarEventModal?.show();
    }
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
            <CalendarEvent
                v-else-if="'calendarEvent' in arg.event.extendedProps"
                :time-text="arg.timeText"
                :calendar-event="arg.event.extendedProps.calendarEvent"
            />
        </template>
    </Calendar>

    <CalendarEventModal
        ref="calendarEventModal"
        :event="clickedCalendarEvent"
        :all-users="allUsers"
        :semester="semester"
        :classrooms="classrooms"
        @submit="refreshCalendarEvents()"
    />

    <LaboratoryClassEditModals
        ref="classEditModals"
        :laboratory-class="editedLaboratoryClass"
        :subject
        :semester
        show-subject
        @submit="refreshClasses"
    />
</template>
