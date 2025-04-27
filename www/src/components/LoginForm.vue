<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';

type FormErrors = {
    email?: ['Email cannot be empty' | 'Enter valid email'];
    password?: ['Password cannot be empty'];
    form?: ['Invalid credentials'];
};

const email = ref<string>('');
const password = ref<string>('');
const errors = ref<FormErrors>({});

async function submit() {
    errors.value = {};
    email.value = email.value.trim();

    if (email.value === '') {
        errors.value.email = ['Email cannot be empty'];
    }

    if (password.value === '') {
        errors.value.password = ['Password cannot be empty'];
    }

    if (Object.keys(errors.value).length === 0) {
        try {
            const result = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
            });

            if (result.ok) {
                window.location.href = '/';
            } else {
                const data = await result.json();
                errors.value = data.errors;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const translations = {
    'en': {
        'Password': 'Password',
        'Log in': 'Log in',
        'Email cannot be empty': 'Email cannot be empty',
        'Enter valid email': 'Enter valid email',
        'Password cannot be empty': 'Password cannot be empty',
        'Invalid credentials': 'Invalid credentials',
    },
    'pl': {
        'Password': 'Hasło',
        'Log in': 'Zaloguj Się',
        'Email cannot be empty': 'Email nie może być pusty',
        'Enter valid email': 'Podaj poprawny email',
        'Password cannot be empty': 'Hasło nie może być puste',
        'Invalid credentials': 'Nieprawidłowe dane logowania',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form @submit.prevent="submit" class="needs-validation" novalidate>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                v-model="email"
                type="email"
                id="email"
                class="form-control"
                placeholder="Email"
                :class="{ 'is-invalid': errors.email }"
                required
            />

            <div v-if="errors.email" class="invalid-feedback">
                {{ translate(errors.email[0]) }}
            </div>
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">{{ 'Password' }}</label>
            <input
                v-model="password"
                type="password"
                id="password"
                class="form-control"
                :placeholder="translate('Password')"
                :class="{ 'is-invalid': errors.password }"
                required
            />
            <div v-if="errors.password" class="invalid-feedback">
                {{ translate(errors.password[0]) }}
            </div>
        </div>

        <div v-if="errors.form" class="invalid-feedback mb-3" style="display: block">
            {{ translate(errors.form[0]) }}
        </div>

        <button type="submit" class="btn btn-success w-100">{{ translate('Log in') }}</button>
    </form>
    <br />
</template>
