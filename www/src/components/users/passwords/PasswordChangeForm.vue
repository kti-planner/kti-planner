<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch } from '@components/api';
import type { PasswordChangeApiData } from '@components/users/passwords/types';
import PasswordInputField from '@components/users/passwords/PasswordInputField.vue';

const submitFailed = ref(false);

const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const newPasswordRepeated = ref<string>('');

async function submit() {
    const success = await apiPatch<boolean>('/users/api/password-change/', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        newPasswordRepeated: newPasswordRepeated.value,
    } satisfies PasswordChangeApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        window.location.reload();
    }
}

const translations = {
    'en': {
        'Current password': 'Current password',
        'New password': 'New password',
        'Repeat new password': 'Repeat new password',
        'Save': 'Save',
        'Changing password failed.': 'Changing password failed.',
    },
    'pl': {
        'Current password': 'Aktualne hasło',
        'New password': 'Nowe hasło',
        'Repeat new password': 'Powtórz nowe hasło',
        'Save': 'Zapisz',
        'Changing password failed.': 'Zmiana hasła nie powiodła się.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const currentId = crypto.randomUUID();
const newId = crypto.randomUUID();
const newRepeatedId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="currentId" class="form-label">{{ translate('Current password') }}</label>
            <PasswordInputField
                :id="currentId"
                v-model="currentPassword"
                :placeholder="translate('Current password')"
                autocomplete="current-password"
            />
        </div>

        <div>
            <label :for="newId" class="form-label">{{ translate('New password') }}</label>
            <PasswordInputField
                :id="newId"
                v-model="newPassword"
                :placeholder="translate('New password')"
                autocomplete="new-password"
            />
        </div>

        <div>
            <label :for="newRepeatedId" class="form-label">{{ translate('Repeat new password') }}</label>
            <PasswordInputField
                :id="newRepeatedId"
                v-model="newPasswordRepeated"
                :placeholder="translate('Repeat new password')"
                autocomplete="new-password"
            />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Save') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Changing password failed.') }}
        </div>
    </form>
</template>
