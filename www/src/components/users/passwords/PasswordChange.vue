<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import Modal from '@components/Modal.vue';
import PasswordChangeForm from '@components/users/passwords/PasswordChangeForm.vue';

const translations = {
    'en': {
        'Change password': 'Change password',
    },
    'pl': {
        'Change password': 'Zmień hasło',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = crypto.randomUUID();
</script>

<template>
    <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
        {{ translate('Change password') }}
    </button>

    <Modal :id="modalId">
        <template #header>
            {{ translate('Change password') }}
        </template>
        <PasswordChangeForm />
    </Modal>
</template>
