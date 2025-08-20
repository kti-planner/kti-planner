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
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>

        <div>
            <label for="password" class="form-label">{{ translate('Password') }}</label>
            <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                :placeholder="translate('Password')"
                required
            />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Sign in') }}</button>
        </div>

        <div v-if="loginFailed" class="text-center text-danger">
            {{ translate('Login failed.') }}
        </div>
    </form>
    <br />
</template>
