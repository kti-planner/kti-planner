<script setup lang="ts">
import { useId } from 'vue';
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import SubjectFrom from '@components/subjects/SubjectFrom.vue';

defineProps<{
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

function translate(text: keyof (typeof translations)['en']): string {
    return translations[langId][text];
}
const modalId = useId();
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
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit Subject') }} {{ subject.name }}</template>
        <SubjectFrom :semester="semester" :subject="subject" />
    </Modal>
</template>
