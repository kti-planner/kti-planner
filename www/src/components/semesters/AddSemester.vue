<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import Modal from '@components/Modal.vue';
import SemesterForm from '@components/semesters/SemesterForm.vue';

const translations = {
    'en': {
        'Add new semester': 'Add new semester',
    },
    'pl': {
        'Add new semester': 'Dodaj nowy semestr',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#semester-modal">
                {{ translate('Add new semester') }}
            </button>
        </div>

        <Modal id="semester-modal">
            <template #header>
                {{ translate('Add new semester') }}
            </template>
            <SemesterForm />
        </Modal>
    </div>
</template>
