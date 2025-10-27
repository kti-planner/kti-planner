<script setup lang="ts">
import { computed } from 'vue';
import { useCloned } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import type { ClassroomData } from '@components/classrooms/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import CopyInput from '@components/CopyInput.vue';

const translations = {
    'en': {
        'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.':
            'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.',
    },
    'pl': {
        'Selected filters will apply to the exported events. Copy the link below and import it in a calendar application.':
            'Wybrane filtry zostaną zastosowane do wyeksportowanych wydarzeń. Skopiuj poniższy link i zaimportuj go w aplikacji kalendarzowej.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { initialSelectedClassrooms, initialSelectedSubjects, initialSelectedTeachers } = defineProps<{
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

const icsUrl = computed<string>(() => {
    const params = new URLSearchParams([
        ...selectedSubjects.value.map(subject => ['subject', subject.id]),
        ...selectedClassrooms.value.map(classroom => ['classroom', classroom.id]),
        ...selectedTeachers.value.map(teacher => ['teacher', teacher.id]),
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
