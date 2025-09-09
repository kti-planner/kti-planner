<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { ClassroomData } from '@components/classrooms/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import ExerciseForm from '@components/exercises/ExerciseForm.vue';
import Modal from '@components/Modal.vue';

defineProps<{
    semester: SemesterData;
    subject: SubjectData;
    classrooms: ClassroomData[];
    nextExerciseNumber: number;
}>();

const translations = {
    'en': {
        'Add new exercise': 'Add new exercise',
    },
    'pl': {
        'Add new exercise': 'Dodaj nowe ćwiczenie',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = crypto.randomUUID();
</script>

<template>
    <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
        {{ translate('Add new exercise') }}
    </button>

    <Modal :id="modalId">
        <template #header>
            {{ translate('Add new exercise') }}
        </template>
        <ExerciseForm :exercise="{ exerciseNumber: nextExerciseNumber }" :semester :subject :classrooms />
    </Modal>
</template>
