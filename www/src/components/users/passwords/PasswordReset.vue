<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { UserData } from '@components/users/types';
import Modal from '@components/Modal.vue';
import PasswordResetForm from '@components/users/passwords/PasswordResetForm.vue';

defineProps<{
    user: UserData;
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
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#password-reset-modal">
                {{ translate('Reset password') }}
            </button>
        </div>

        <Modal id="password-reset-modal">
            <template #header>
                {{ translate('Reset password') }}
            </template>
            <PasswordResetForm :user="user" />
        </Modal>
    </div>
</template>
