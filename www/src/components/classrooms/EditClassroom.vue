<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import ClassroomForm from './ClassroomForm.vue';
import type { ClassroomData } from './types';

const props = defineProps<{
    classroom: ClassroomData;
}>();

const translations = {
    'en': {
        'Edit classroom': 'Edit classroom',
    },
    'pl': {
        'Edit classroom': 'Edytuj salę',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = `edit-classroom-modal-${props.classroom.id}`;
</script>

<template>
    <IconButton
        icon="pencil"
        aria-label="Edit exercise"
        class="ms-1 justify-content-between"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit classroom')"
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit classroom') }} {{ classroom.name }}</template>
        <ClassroomForm :classroom="classroom" />
    </Modal>
</template>
