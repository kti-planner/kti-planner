<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { UserData } from '@components/users/types';
import Modal from '@components/Modal.vue';
import RoleForm from '@components/users/RoleForm.vue';

const props = defineProps<{
    user: UserData;
}>();

const translations = {
    'en': {
        'Edit role': 'Edit role',
    },
    'pl': {
        'Edit role': 'Edytuj rolę',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = `edit-role-modal-${props.user.id}`;
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
                {{ translate('Edit role') }}
            </button>
        </div>

        <Modal :id="modalId">
            <template #header>{{ translate('Edit role') }}</template>
            <RoleForm :user="user" />
        </Modal>
    </div>
</template>
