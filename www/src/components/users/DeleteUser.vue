<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import { apiDelete } from '@components/api';
import type { UserDetailsData } from '@components/users/types';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';

const { user } = defineProps<{
    user: UserDetailsData;
}>();

const translations = {
    'en': {
        'Delete user': 'Delete user',
    },
    'pl': {
        'Delete user': 'Usuń użytkownika',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

async function doDelete() {
    const result = await apiDelete<boolean>('/api/users/users/', new URLSearchParams({ id: user.id }));

    if (result) {
        window.location.assign('/users/');
    }
}
</script>

<template>
    <ButtonWithConfirmationPopover class="btn btn-danger" @click="doDelete()">
        {{ translate('Delete user') }}
    </ButtonWithConfirmationPopover>
</template>
