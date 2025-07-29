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
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exercise-modal">
                {{ translate('Add new exercise') }}
            </button>
        </div>

        <Modal id="exercise-modal">
            <template #header>
                {{ translate('Add new exercise') }}
            </template>
            <ExerciseForm
                :exercise="{ exerciseNumber: nextExerciseNumber }"
                :semester="semester"
                :subject="subject"
                :classrooms="classrooms"
            />
        </Modal>
    </div>
</template>
