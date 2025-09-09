<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import Modal from '@components/Modal.vue';
import UserForm from '@components/users/UserForm.vue';

const translations = {
    'en': {
        'Add new user': 'Add new user',
    },
    'pl': {
        'Add new user': 'Dodaj nowego użytkownika',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = crypto.randomUUID();
</script>

<template>
    <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
        {{ translate('Add new user') }}
    </button>

    <Modal :id="modalId">
        <template #header>
            {{ translate('Add new user') }}
        </template>
        <UserForm />
    </Modal>
</template>
