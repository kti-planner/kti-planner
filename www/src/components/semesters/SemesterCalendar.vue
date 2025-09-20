<script setup lang="ts">
import { computed, ref } from 'vue';
import type { EventInput } from '@fullcalendar/core';
import { langId } from '@components/frontend/lang';
import { useApiFetch } from '@components/api';
import { getInitialDate, getLaboratoryClassEvents, getScheduleChangeEvents } from '@components/calendar/events';
import type { ClassroomData } from '@components/classrooms/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import Calendar from '@components/Calendar.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';
import ToggleButtonPicker from '@components/ToggleButtonPicker.vue';

const translations = {
    'en': {
        'Subjects': 'Subjects',
        'Classrooms': 'Classrooms',
        'Teachers': 'Teachers',
    },
    'pl': {
        'Subjects': 'Przedmioty',
        'Classrooms': 'Sale',
        'Teachers': 'Prowadzący',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { semester, scheduleChanges, subjects, classrooms } = defineProps<{
    semester: SemesterData;
    scheduleChanges: ScheduleChangeData[];
    subjects: SubjectData[];
    classrooms: ClassroomData[];
}>();

const teachers = computed<UserData[]>(() => {
    const allTeachers = subjects.flatMap(subject => subject.teachers);
    const teachersById = Object.groupBy(allTeachers, teacher => teacher.id);
    return Object.values(teachersById).map<UserData>(teachers => teachers![0]!);
});

const selectedSubjects = ref<SubjectData[]>([]);
const selectedClassrooms = ref<ClassroomData[]>([]);
const selectedTeachers = ref<UserData[]>([]);

const { data: laboratoryClasses } = useApiFetch<LaboratoryClassData[]>(
    `/semesters/${semester.slug}/api/laboratory-classes/`,
    () =>
        new URLSearchParams([
            ...selectedSubjects.value.map(subject => ['subject', subject.id]),
            ...selectedClassrooms.value.map(classroom => ['classroom', classroom.id]),
            ...selectedTeachers.value.map(teacher => ['teacher', teacher.id]),
        ]),
);

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? []),
    ...getScheduleChangeEvents(scheduleChanges),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));

const subjectOptions = computed(() => Object.fromEntries(subjects.map(subject => [subject.name, subject])));
const classroomOptions = computed(() => Object.fromEntries(classrooms.map(classroom => [classroom.name, classroom])));
const teacherOptions = computed(() => Object.fromEntries(teachers.value.map(teacher => [teacher.name, teacher])));
</script>

<template>
    <div class="row g-4">
        <div class="col-12 col-lg-9 mb-2 order-2 order-lg-1">
            <Calendar :events :initial-date>
                <template #eventContent="arg">
                    <LaboratoryClassEvent
                        v-if="'laboratoryClass' in arg.event.extendedProps"
                        :time-text="arg.timeText"
                        :laboratory-class="arg.event.extendedProps.laboratoryClass"
                        :subject="
                            subjects.find(s => s.id === arg.event.extendedProps.laboratoryClass.exercise.subjectId)
                        "
                    />
                </template>
            </Calendar>
        </div>
        <div class="col-12 col-lg-3 order-1 order-lg-2 d-flex gap-3 flex-column-reverse flex-lg-column">
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Subjects') }}
                </h2>
                <ToggleButtonPicker v-model="selectedSubjects" :options="subjectOptions" />
            </div>
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Classrooms') }}
                </h2>
                <ToggleButtonPicker v-model="selectedClassrooms" :options="classroomOptions" />
            </div>
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Teachers') }}
                </h2>
                <ToggleButtonPicker v-model="selectedTeachers" :options="teacherOptions" />
            </div>
        </div>
    </div>
</template>
