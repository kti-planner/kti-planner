<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import SemesterForm from '@components/semesters/SemesterForm.vue';

const props = defineProps<{
    semester: SemesterData;
}>();

const translations = {
    'en': {
        'Edit semester': 'Edit semester',
    },
    'pl': {
        'Edit semester': 'Edytuj semestr',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = `edit-semester-modal-${props.semester.slug}`;
</script>

<template>
    <IconButton
        icon="pencil"
        position="absolute"
        aria-label="Edit semester"
        class="ms-1"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit semester') }} {{ semester.year }}/{{ semester.year + 1 }}</template>
        <SemesterForm :semester="semester" />
    </Modal>
</template>
