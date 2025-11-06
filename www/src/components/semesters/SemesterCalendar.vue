<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef, watchEffect } from 'vue';
import type { DateSelectArg, EventClickArg, EventInput, ViewApi } from '@fullcalendar/core';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { useApiFetch } from '@components/api';
import {
    getCalendarEvents,
    getInitialDate,
    getLaboratoryClassEvents,
    getScheduleChangeEvents,
} from '@components/calendar/events';
import type { CalendarEventData } from '@components/calendar-events/types';
import { type ClassroomData, formatClassroomName } from '@components/classrooms/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import { formatDateLocalYyyyMmDdHhMm } from '@components/utils';
import Calendar from '@components/Calendar.vue';
import CalendarExportForm from '@components/calendar/CalendarExportForm.vue';
import CalendarEvent from '@components/calendar-events/CalendarEvent.vue';
import CalendarEventForm from '@components/calendar-events/CalendarEventForm.vue';
import LaboratoryClassEditModals from '@components/laboratory-classes/LaboratoryClassEditModals.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';
import Modal from '@components/Modal.vue';
import ToggleButtonPicker from '@components/ToggleButtonPicker.vue';

const translations = {
    'en': {
        'Subjects': 'Subjects',
        'Classrooms': 'Classrooms',
        'Teachers': 'Teachers',
        'Edit class': 'Edit class',
        'Class details': 'Class details',
        'Add event': 'Add event',
        'Edit event': 'Edit event',
        'Event details': 'Event details',
        'Export calendar': 'Export calendar',
    },
    'pl': {
        'Subjects': 'Przedmioty',
        'Classrooms': 'Sale',
        'Teachers': 'Prowadzący',
        'Edit class': 'Edytuj zajęcia',
        'Class details': 'Szczegóły zajęć',
        'Add event': 'Dodaj wydarzenie',
        'Edit event': 'Edytuj wydarzenie',
        'Event details': 'Szczegóły wydarzenia',
        'Export calendar': 'Eksport kalendarza',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { semester, scheduleChanges, subjects, classrooms, subjectGroups } = defineProps<{
    semester: SemesterData;
    scheduleChanges: ScheduleChangeData[];
    subjects: SubjectData[];
    classrooms: ClassroomData[];
    allUsers: UserPublicData[];
    subjectGroups: { subjectsData: SubjectData[]; title: string }[];
}>();

const teachers = computed<UserPublicData[]>(() => {
    const allTeachers = subjects.flatMap(subject => subject.teachers);
    const teachersById = Object.groupBy(allTeachers, teacher => teacher.id);
    return Object.values(teachersById).map<UserPublicData>(teachers => teachers![0]!);
});

const selectedClassrooms = ref<ClassroomData[]>([]);
const selectedTeachers = ref<UserPublicData[]>([]);

const subjectColors = computed(() => Object.fromEntries(subjects.map(subject => [subject.id, subject.color])));

const subjectGroupSelections = ref<Record<string, SubjectData[]>>({});

watchEffect(() => {
    subjectGroupSelections.value = subjectGroups.reduce(
        (selections, group) => {
            selections[group.title] = [];
            return selections;
        },
        {} as Record<string, SubjectData[]>,
    );
});

const selectedSubjects = computed<SubjectData[]>(() => {
    return Object.values(subjectGroupSelections.value).flat();
});

const { data: laboratoryClasses, execute: refetchLaboratoryClasses } = useApiFetch<LaboratoryClassData[]>(
    `/semesters/${semester.slug}/api/laboratory-classes/`,
    () =>
        new URLSearchParams([
            ...selectedSubjects.value.map(subject => ['subject', subject.id]),
            ...selectedClassrooms.value.map(classroom => ['classroom', classroom.id]),
            ...selectedTeachers.value.map(teacher => ['teacher', teacher.id]),
        ]),
);

const { data: calendarEvents, execute: refetchCalendarEvents } = useApiFetch<CalendarEventData[]>(
    `/semesters/${semester.slug}/api/calendar-events/`,
    () =>
        new URLSearchParams([
            ...selectedClassrooms.value.map(classroom => ['classroom', classroom.id]),
            ...selectedTeachers.value.map(teacher => ['teacher', teacher.id]),
        ]),
);

async function refetchAllEvents() {
    await Promise.all([refetchLaboratoryClasses(), refetchCalendarEvents()]);
}

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? [], subjects),
    ...getScheduleChangeEvents(scheduleChanges),
    ...getCalendarEvents(calendarEvents.value ?? []),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));

const subjectGroupsOptions = computed(() =>
    subjectGroups
        .filter(group => group.subjectsData.length > 0)
        .map(group => ({
            title: group.title,
            subjectOptions: Object.fromEntries(group.subjectsData.map(subject => [subject.fullName, subject])),
        })),
);

const classroomOptions = computed(() =>
    Object.fromEntries([
        ...classrooms.map(classroom => [classroom.name, classroom]),
        [formatClassroomName(null, langId), { id: 'null', name: formatClassroomName(null, langId) }],
    ]),
);

const teacherOptions = computed(() => Object.fromEntries(teachers.value.map(teacher => [teacher.name, teacher])));

const classEditModals = useTemplateRef('classEditModals');
const clickedLaboratoryClass = shallowRef<LaboratoryClassData | null>(null);
const clickedClassSubject = shallowRef<SubjectData | null>(null);

const calendarEventModal = useTemplateRef('calendarEventModal');
const clickedCalendarEvent = shallowRef<CalendarEventData | null>(null);
const calendarSelectionStart = shallowRef<Date | null>(new Date());
const calendarSelectionEnd = shallowRef<Date | null>(new Date());

const exportModal = useTemplateRef('exportModal');

function handleEventClick(arg: EventClickArg) {
    if ('laboratoryClass' in arg.event.extendedProps) {
        clickedLaboratoryClass.value = arg.event.extendedProps.laboratoryClass;

        clickedClassSubject.value =
            subjects.find(s => s.id === clickedLaboratoryClass.value!.exercise.subjectId) ?? null;

        classEditModals.value?.classDetailsModal?.show();
    }

    if ('calendarEvent' in arg.event.extendedProps) {
        clickedCalendarEvent.value = arg.event.extendedProps.calendarEvent;
        calendarEventModal.value?.show();
    }
}

function handleCalendarSelection(info: DateSelectArg) {
    calendarSelectionStart.value = info.start;
    calendarSelectionEnd.value = info.end;
    clickedCalendarEvent.value = null;

    calendarEventModal.value?.show();
}

function handleCalendarEventSubmit() {
    calendarEventModal.value?.hide();
    void refetchAllEvents();
}

function handleAddEventClick() {
    calendarSelectionStart.value = null;
    calendarSelectionEnd.value = null;
    clickedCalendarEvent.value = null;

    calendarEventModal.value?.show();
}

const currentView = ref<string>('');

function handleViewChange(view: ViewApi) {
    currentView.value = view.type;
}
</script>

<template>
    <div class="row g-4">
        <div class="col-12 col-lg-9 mb-2 order-2 order-lg-1">
            <Calendar
                :events
                :initial-date
                :selectable="currentUser !== null"
                @event-click="handleEventClick"
                @select="handleCalendarSelection"
                @view-change="handleViewChange"
            >
                <template #eventContent="arg">
                    <LaboratoryClassEvent
                        v-if="'laboratoryClass' in arg.event.extendedProps"
                        :time-text="arg.timeText"
                        :laboratory-class="arg.event.extendedProps.laboratoryClass"
                        :subject="
                            subjects.find(s => s.id === arg.event.extendedProps.laboratoryClass.exercise.subjectId)
                        "
                        :view-type="currentView"
                    />
                    <CalendarEvent
                        v-else-if="'calendarEvent' in arg.event.extendedProps"
                        :time-text="arg.timeText"
                        :calendar-event="arg.event.extendedProps.calendarEvent"
                    />
                </template>
            </Calendar>

            <Modal ref="calendarEventModal">
                <template #header>{{
                    clickedCalendarEvent === null
                        ? translate('Add event')
                        : currentUser
                          ? translate('Edit event')
                          : translate('Event details')
                }}</template>
                <CalendarEventForm
                    :semester
                    :classrooms
                    :calendar-event="
                        clickedCalendarEvent ?? {
                            startDate: calendarSelectionStart
                                ? formatDateLocalYyyyMmDdHhMm(calendarSelectionStart)
                                : '',
                            endDate: calendarSelectionEnd ? formatDateLocalYyyyMmDdHhMm(calendarSelectionEnd) : '',
                        }
                    "
                    :users="allUsers"
                    @submit="handleCalendarEventSubmit"
                />
            </Modal>

            <LaboratoryClassEditModals
                ref="classEditModals"
                :laboratory-class="clickedLaboratoryClass"
                :subject="clickedClassSubject"
                :teachers
                :semester
                show-subject
                @submit="refetchAllEvents"
            />

            <Modal ref="exportModal">
                <template #header>{{ translate('Export calendar') }}</template>
                <CalendarExportForm
                    :semester
                    :subjects
                    :classrooms
                    :teachers
                    :initial-selected-subjects="selectedSubjects"
                    :initial-selected-classrooms="selectedClassrooms"
                    :initial-selected-teachers="selectedTeachers"
                    :subject-groups="subjectGroups"
                />
            </Modal>
        </div>
        <div class="col-12 col-lg-3 order-1 order-lg-2 d-flex gap-2 flex-column-reverse flex-lg-column">
            <button
                v-if="currentUser"
                type="button"
                class="btn btn-success mx-auto"
                style="width: fit-content"
                @click="handleAddEventClick()"
            >
                {{ translate('Add event') }}
            </button>
            <button
                type="button"
                class="btn btn-success mx-auto"
                style="width: fit-content"
                @click="exportModal?.show()"
            >
                {{ translate('Export calendar') }}
            </button>
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Subjects') }}
                </h2>

                <template v-for="{ subjectOptions, title } in subjectGroupsOptions" :key="title">
                    <h2 class="fs-6 text-center mt-3">{{ title }}</h2>
                    <ToggleButtonPicker
                        v-model="subjectGroupSelections[title]!"
                        center
                        :options="subjectOptions"
                        :colors="subjectColors"
                    />
                </template>
            </div>
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Classrooms') }}
                </h2>
                <ToggleButtonPicker v-model="selectedClassrooms" center :options="classroomOptions" />
            </div>
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Teachers') }}
                </h2>
                <ToggleButtonPicker v-model="selectedTeachers" center :options="teacherOptions" />
            </div>
        </div>
    </div>
</template>
