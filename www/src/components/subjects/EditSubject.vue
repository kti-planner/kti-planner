<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import SubjectForm from '@components/subjects/SubjectForm.vue';

defineProps<{
    semester: SemesterData;
    subject: SubjectData;
    allUsers: UserData[];
}>();

const translations = {
    'en': {
        'Edit subject': 'Edit subject',
    },
    'pl': {
        'Edit subject': 'Edytuj przedmiot',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = crypto.randomUUID();
</script>

<template>
    <IconButton
        icon="pencil"
        position="absolute"
        :aria-label="translate('Edit subject')"
        class="ms-1"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit subject')"
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit subject') }} {{ subject.name }}</template>
        <SubjectForm :semester :subject :all-users />
    </Modal>
</template>
