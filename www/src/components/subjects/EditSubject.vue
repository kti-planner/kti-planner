<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import SubjectForm from '@components/subjects/SubjectForm.vue';

const props = defineProps<{
    semester: SemesterData;
    subject: SubjectData;
}>();

const translations = {
    'en': {
        'Edit Subject': 'Edit subject',
    },
    'pl': {
        'Edit Subject': 'Edytuj przedmiot',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = `edit-subject-modal-${props.semester.slug}-${props.subject.slug}`;
</script>

<template>
    <IconButton
        icon="pencil"
        position="absolute"
        aria-label="Edit subject"
        class="ms-1"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit Subject')"
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit Subject') }} {{ subject.name }}</template>
        <SubjectForm :semester="semester" :subject="subject" />
    </Modal>
</template>
