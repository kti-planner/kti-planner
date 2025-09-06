<script setup lang="ts">
import { useId } from 'vue';
import { langId } from '@components/frontend/lang';
import type { ClassroomData } from '@components/classrooms/types';
import ClassroomForm from '@components/classrooms/ClassroomForm.vue';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';

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

const modalId = `${useId()}-${props.classroom.id}`;
</script>

<template>
    <IconButton
        icon="pencil"
        :aria-label="translate('Edit classroom')"
        class="ms-1"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit classroom')"
    />

    <Modal :id="modalId">
        <template #header>{{ translate('Edit classroom') }} {{ classroom.name }}</template>
        <ClassroomForm :classroom />
    </Modal>
</template>
