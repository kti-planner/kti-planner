<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPost } from '@components/api';
import type { LoginApiData } from '@components/users/types';

const { nextPage } = defineProps<{
    nextPage: string;
}>();

const email = ref<string>('');
const password = ref<string>('');

const loginFailed = ref<boolean>(false);

async function submit() {
    const loginSuccess = await apiPost<boolean>('/api/login/', {
        email: email.value.trim(),
        password: password.value,
    } satisfies LoginApiData);

    if (loginSuccess === undefined) {
        return;
    }

    loginFailed.value = !loginSuccess;
    password.value = '';

    if (loginSuccess) {
        window.location.href = nextPage;
    }
}

const translations = {
    'en': {
        'Password': 'Password',
        'Sign in': 'Sign in',
        'Login failed.': 'Login failed.',
    },
    'pl': {
        'Password': 'Hasło',
        'Sign in': 'Zaloguj się',
        'Login failed.': 'Logowanie nie powiodło się.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const emailId = crypto.randomUUID();
const passwordId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="emailId" class="form-label">Email</label>
            <input :id="emailId" v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>

        <div>
            <label :for="passwordId" class="form-label">{{ translate('Password') }}</label>
            <input
                :id="passwordId"
                v-model="password"
                type="password"
                class="form-control"
                :placeholder="translate('Password')"
                required
            />
        </div>

        <div class="text-center mt-2">
            <button type="submit" class="btn btn-success">{{ translate('Sign in') }}</button>
        </div>

        <div v-if="loginFailed" class="text-center text-danger">
            {{ translate('Login failed.') }}
        </div>
    </form>
    <br />
</template>
