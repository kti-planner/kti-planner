<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { UserData } from '@components/users/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import PasswordChange from '@components/users/passwords/PasswordChange.vue';
import PasswordReset from '@components/users/passwords/PasswordReset.vue';
import UserForm from '@components/users/UserForm.vue';

const props = defineProps<{
    userEditing: UserData;
    userToEdit: UserData;
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

const modalId = `edit-user-modal-${props.userToEdit.id}`;
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
        <template #header> {{ translate('Edit user') }} {{ props.userToEdit.name }} </template>
        <UserForm :user="userToEdit" :is-admin="userEditing.role === 'admin'" />
        <template #footer>
            <PasswordReset v-if="userEditing.role === 'admin'" :user="userToEdit" />
            <PasswordChange v-if="userEditing.id === userToEdit.id && userEditing.role === 'teacher'" />
        </template>
    </Modal>
</template>
