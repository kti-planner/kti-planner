<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import ClassroomForm from '@components/classrooms/ClassroomForm.vue';
import Modal from '@components/Modal.vue';

const translations = {
    'en': {
        'Add new classroom': 'Add new classroom',
    },
    'pl': {
        'Add new classroom': 'Dodaj nową salę',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#classroom-modal">
                {{ translate('Add new classroom') }}
            </button>
        </div>

        <Modal id="classroom-modal">
            <template #header>
                {{ translate('Add new classroom') }}
            </template>
            <ClassroomForm />
        </Modal>
    </div>
</template>
