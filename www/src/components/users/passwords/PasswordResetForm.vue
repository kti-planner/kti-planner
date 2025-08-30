<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch } from '@components/api';
import type { PasswordResetApiData } from '@components/users/passwords/types';
import type { UserData } from '@components/users/types';
import { generatePassword } from '@components/utils';
import PasswordInputField from '@components/users/passwords/PasswordInputField.vue';

const props = defineProps<{
    user: UserData;
}>();

const password = ref<string>('');

const passwordVisible = ref<boolean>(false);

async function submit() {
    const success = await apiPatch<boolean>('/users/api/password-reset/', {
        id: props.user?.id,
        password: password.value,
    } satisfies PasswordResetApiData);

    if (success === undefined) {
        return;
    }

    if (success) {
        window.location.reload();
    }
}

function regeneratePassword(): void {
    password.value = generatePassword();
    passwordVisible.value = true;
}

const translations = {
    'en': {
        'New password': 'New password',
        'Generate random password': 'Generate random password',
        'Save': 'Save',
    },
    'pl': {
        'New password': 'Nowe hasło',
        'Save': 'Zapisz',
        'Generate random password': 'Wygeneruj losowe hasło',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="password" class="form-label">{{ translate('New password') }}</label>
            <PasswordInputField
                id="password"
                v-model="password"
                v-model:visible="passwordVisible"
                :placeholder="translate('New password')"
                autocomplete="new-password"
            />
            <button type="button" class="btn btn-success btn-sm my-2" @click="regeneratePassword()">
                {{ translate('Generate random password') }}
            </button>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Save') }}</button>
        </div>
    </form>
</template>
