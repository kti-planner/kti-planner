<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useCloned } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import { type ClassroomData, formatClassroomName } from '@components/classrooms/types';
import type { SemesterData } from '@components/semesters/types';
import { makeSubjectStudyDetails, type SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import Accordion from '@components/accordion/Accordion.vue';
import AccordionItem from '@components/accordion/AccordionItem.vue';
import CalendarSubjectExportOptions from '@components/calendar/CalendarSubjectExportOptions.vue';
import CopyInput from '@components/CopyInput.vue';
import ToggleButtonPicker from '@components/ToggleButtonPicker.vue';

const translations = {
    'en': {
        'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.':
            'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.',
        'Subjects': 'Subjects',
        'Classrooms': 'Classrooms',
        'Teachers': 'Teachers',
        'Export this subject': 'Export this subject',
    },
    'pl': {
        'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.':
            'Wybrane filtry zostaną zastosowane do wyeksportowanych wydarzeń. Skopiuj poniższy link i zaimportuj go w aplikacji kalendarzowej.',
        'Subjects': 'Przedmioty',
        'Classrooms': 'Sale',
        'Teachers': 'Prowadzący',
        'Export this subject': 'Eksportuj ten przedmiot',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { initialSelectedClassrooms, initialSelectedSubjects, initialSelectedTeachers, subjects, classrooms, teachers } =
    defineProps<{
        semester: SemesterData;
        subjects: SubjectData[];
        classrooms: ClassroomData[];
        teachers: UserPublicData[];
        initialSelectedSubjects: SubjectData[];
        initialSelectedClassrooms: ClassroomData[];
        initialSelectedTeachers: UserPublicData[];
    }>();

const { cloned: selectedSubjects } = useCloned(computed(() => initialSelectedSubjects));
const { cloned: selectedClassrooms } = useCloned(computed(() => initialSelectedClassrooms));
const { cloned: selectedTeachers } = useCloned(computed(() => initialSelectedTeachers));

const classroomOptions = computed(() =>
    Object.fromEntries([
        ...classrooms.map(classroom => [classroom.name, classroom]),
        [formatClassroomName(null, langId), { id: 'null', name: formatClassroomName(null, langId) }],
    ]),
);

const teacherOptions = computed(() => Object.fromEntries(teachers.map(teacher => [teacher.name, teacher])));

const selectedSubjectIds = ref(new Set<string>(selectedSubjects.value.map(subject => subject.id)));

watchEffect(() => {
    selectedSubjects.value = subjects.filter(subject => selectedSubjectIds.value.has(subject.id));
});

const selectedGroupIds = ref(new Set<string>());

const icsUrl = computed<string>(() => {
    const params = new URLSearchParams([
        ...selectedSubjects.value.map(subject => ['subject', subject.id]),
        ...selectedClassrooms.value.map(classroom => ['classroom', classroom.id]),
        ...selectedTeachers.value.map(teacher => ['teacher', teacher.id]),
        ...[...selectedGroupIds.value].map(id => ['laboratoryGroup', id]),
        ['lang', langId],
    ]);

    const baseUrl = `${window.location.origin}${window.location.pathname}api/ics/`;
    if (params.size === 0) {
        return baseUrl;
    }

    return `${baseUrl}?${params}`;
});

const icsUrlId = crypto.randomUUID();
</script>

<template>
    <div class="mb-3">
        <h2 class="fs-6">
            {{ translate('Subjects') }}
        </h2>
        <Accordion>
            <AccordionItem v-for="subject in subjects" :key="subject.id" :id="subject.id">
                <template #header>{{ subject.fullName }} {{ makeSubjectStudyDetails(subject, langId) }}</template>
                <CalendarSubjectExportOptions
                    v-model:subjects="selectedSubjectIds"
                    v-model:groups="selectedGroupIds"
                    :semester
                    :subject
                />
            </AccordionItem>
        </Accordion>
    </div>
    <div class="mb-3">
        <h2 class="fs-6">
            {{ translate('Classrooms') }}
        </h2>
        <ToggleButtonPicker v-model="selectedClassrooms" :options="classroomOptions" />
    </div>
    <div class="mb-4">
        <h2 class="fs-6">
            {{ translate('Teachers') }}
        </h2>
        <ToggleButtonPicker v-model="selectedTeachers" :options="teacherOptions" />
    </div>
    <p>
        {{
            translate(
                'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.',
            )
        }}
    </p>
    <label class="form-label" :for="icsUrlId">iCalendar/WebCal link</label>
    <CopyInput :id="icsUrlId" :value="icsUrl" />
</template>
