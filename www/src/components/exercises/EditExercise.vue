<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import ExerciseForm from '@components/exercises/ExerciseForm.vue';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';

const props = defineProps<{
    semester: SemesterData;
    subject: SubjectData;
    exercise: ExerciseData;
    classrooms: ClassroomData[];
}>();

const translations = {
    'en': {
        'Edit exercise': 'Edit exercise',
    },
    'pl': {
        'Edit exercise': 'Edytuj ćwiczenie',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = `edit-exercise-modal-${props.semester.slug}-${props.subject.slug}-${props.exercise.exerciseNumber}`;
</script>

<template>
    <IconButton
        icon="pencil"
        position="absolute"
        aria-label="Edit exercise"
        class="ms-1"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit exercise') }} {{ exercise.name }}</template>
        <ExerciseForm :semester="semester" :subject="subject" :exercise="exercise" :classrooms="classrooms" />
    </Modal>
</template>
