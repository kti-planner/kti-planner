<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch } from '@components/api';
import type { PasswordChangeApiData } from '@components/users/passwords/types';

const submitFailed = ref(false);

const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const newPasswordRepeated = ref<string>('');

const currentPasswordVisible = ref<boolean>(false);
const newPasswordVisible = ref<boolean>(false);
const newPasswordRepeatedVisible = ref<boolean>(false);

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
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="currentPassword" class="form-label">{{ translate('Current password') }}</label>
            <div class="input-group">
                <input
                    id="currentPassword"
                    v-model="currentPassword"
                    :type="currentPasswordVisible ? 'text' : 'password'"
                    class="form-control"
                    :placeholder="translate('Current password')"
                    autocomplete="current-password"
                    required
                />
                <button
                    type="button"
                    class="btn border focus-ring"
                    @click="currentPasswordVisible = !currentPasswordVisible"
                >
                    <i class="bi" :class="`bi-${currentPasswordVisible ? 'eye-slash' : 'eye'}`"></i>
                </button>
            </div>
        </div>

        <div>
            <label for="newPassword" class="form-label">{{ translate('New password') }}</label>
            <div class="input-group">
                <input
                    id="newPassword"
                    v-model="newPassword"
                    :type="newPasswordVisible ? 'text' : 'password'"
                    class="form-control"
                    :placeholder="translate('New password')"
                    autocomplete="new-password"
                    required
                />
                <button type="button" class="btn border focus-ring" @click="newPasswordVisible = !newPasswordVisible">
                    <i class="bi" :class="`bi-${newPasswordVisible ? 'eye-slash' : 'eye'}`"></i>
                </button>
            </div>
        </div>

        <div>
            <label for="newPasswordRepeated" class="form-label">{{ translate('Repeat new password') }}</label>
            <div class="input-group">
                <input
                    id="newPasswordRepeated"
                    v-model="newPasswordRepeated"
                    :type="newPasswordRepeatedVisible ? 'text' : 'password'"
                    class="form-control"
                    :placeholder="translate('Repeat new password')"
                    autocomplete="new-password"
                    required
                />
                <button
                    type="button"
                    class="btn border focus-ring"
                    @click="newPasswordRepeatedVisible = !newPasswordRepeatedVisible"
                >
                    <i class="bi" :class="`bi-${newPasswordRepeatedVisible ? 'eye-slash' : 'eye'}`"></i>
                </button>
            </div>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Save') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Changing password failed.') }}
        </div>
    </form>
</template>
