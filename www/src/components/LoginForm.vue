<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';

const email = ref<string>('');
const password = ref<string>('');

const loginFailed = ref<boolean>(false);

async function submit() {
    try {
        const result = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value.trim(),
                password: password.value,
            }),
        });

        if (!result.ok) {
            console.error('API request failed!');
            return;
        }

        const loginSuccess = (await result.json()) as boolean;
        loginFailed.value = !loginSuccess;
        password.value = '';

        if (loginSuccess) {
            window.location.href = '/';
        }
    } catch (error) {
        console.log(error);
    }
}

const translations = {
    'en': {
        'Password': 'Password',
        'Log in': 'Log in',
        'Login failed.': 'Login failed.',
    },
    'pl': {
        'Password': 'Hasło',
        'Log in': 'Zaloguj się',
        'Login failed.': 'Logowanie nie powiodło się.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form @submit.prevent="submit" class="vstack gap-3 mx-auto" style="max-width: 500px">
        <div>
            <label for="email" class="form-label">Email</label>
            <input v-model="email" type="email" id="email" class="form-control" placeholder="Email" required />
        </div>

        <div>
            <label for="password" class="form-label">{{ 'Password' }}</label>
            <input
                v-model="password"
                type="password"
                id="password"
                class="form-control"
                :placeholder="translate('Password')"
                required
            />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Log in') }}</button>
        </div>

        <div v-if="loginFailed" class="text-center text-danger">
            {{ translate('Login failed.') }}
        </div>
    </form>
    <br />
</template>
