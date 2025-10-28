<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import Modal from '@components/Modal.vue';
import CopySubjectForm from '@components/subjects/CopySubjectForm.vue';

defineProps<{
    semester: SemesterData;
}>();

const translations = {
    'en': {
        'Copy subject from previous semester': 'Copy subject from previous semester',
    },
    'pl': {
        'Copy subject from previous semester': 'Skopiuj przedmiot z poprzedniego semestru',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = crypto.randomUUID();
</script>

<template>
    <div class="mx-auto">
        <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            {{ translate('Copy subject from previous semester') }}
        </button>
    </div>

    <Modal :id="modalId">
        <template #header>
            {{ translate('Copy subject from previous semester') }}
        </template>
        <CopySubjectForm :current-semester="semester" />
    </Modal>
</template>
