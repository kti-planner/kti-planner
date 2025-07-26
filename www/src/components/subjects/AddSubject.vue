<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import Modal from '@components/Modal.vue';
import SubjectFrom from '@components/subjects/SubjectFrom.vue';

defineProps<{
    semester: SemesterData;
}>();

const translations = {
    'en': {
        'Add new subject': 'Add new subject',
    },
    'pl': {
        'Add new subject': 'Dodaj nowy przedmiot',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#subject-modal">
                {{ translate('Add new subject') }}
            </button>
        </div>

        <Modal id="subject-modal">
            <template #header>
                {{ translate('Add new subject') }}
            </template>
            <SubjectFrom :semester="semester" />
        </Modal>
    </div>
</template>
