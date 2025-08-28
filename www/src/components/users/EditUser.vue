<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import type { UserData } from '@components/users/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import PasswordChange from '@components/users/passwords/PasswordChange.vue';
import PasswordReset from '@components/users/passwords/PasswordReset.vue';
import UserForm from '@components/users/UserForm.vue';

const props = defineProps<{
    user: UserData;
}>();

const translations = {
    'en': {
        'Edit user': 'Edit user',
    },
    'pl': {
        'Edit user': 'Edytuj użytkownika',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = `edit-user-modal-${props.user.id}`;
</script>

<template>
    <IconButton
        icon="pencil"
        position="absolute"
        :aria-label="translate('Edit user')"
        class="ms-1"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit user')"
    />

    <Modal :id="modalId" footer-class="justify-content-center">
        <template #header> {{ translate('Edit user') }} {{ props.user.name }} </template>
        <UserForm :user />
        <template #footer>
            <PasswordReset v-if="currentUser?.role === 'admin'" :user />
            <PasswordChange v-if="currentUser?.id === user.id && currentUser?.role === 'teacher'" />
        </template>
    </Modal>
</template>
