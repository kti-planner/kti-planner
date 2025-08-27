<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { UserData } from '@components/users/types';
import IconButton from '@components/IconButton.vue';
import Modal from '@components/Modal.vue';
import UserForm from '@components/users/UserForm.vue';

const props = defineProps<{
    isAdmin: boolean;
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

    <Modal :id="modalId">
        <template #header> {{ translate('Edit user') }} {{ props.user.name }} </template>
        <UserForm :user="user" :is-admin="isAdmin" />
    </Modal>
</template>
