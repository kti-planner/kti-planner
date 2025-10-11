<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { UserPublicData } from '@components/users/types';
import Modal from '@components/Modal.vue';
import PasswordResetForm from '@components/users/passwords/PasswordResetForm.vue';

defineProps<{
    user: UserPublicData;
}>();

const translations = {
    'en': {
        'Reset password': 'Reset password',
    },
    'pl': {
        'Reset password': 'Zresetuj hasło',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = crypto.randomUUID();
</script>

<template>
    <div class="mx-auto">
        <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
            {{ translate('Reset password') }}
        </button>
    </div>

    <Modal :id="modalId">
        <template #header>
            {{ translate('Reset password') }}
        </template>
        <PasswordResetForm :user />
    </Modal>
</template>
