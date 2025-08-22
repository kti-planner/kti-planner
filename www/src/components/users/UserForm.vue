<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import type { UserCreateApiData, UserEditApiData, UserData } from '@components/users/types';
import { apiPatch, apiPost } from '@components/api';
import type { UserRole } from '@backend/user';

const props = defineProps<{
    user?: UserData;
}>();

const isEditing = computed(() => props.user !== undefined);

const submitFailed = ref(false);

const name = ref<string | undefined>(props.user?.name);
const email = ref<string | undefined>(props.user?.email);
const password = ref<string>('');
const passwordRepeated = ref<string>('');
const role = ref<UserRole>('teacher');

async function submit() {
    if (name.value === undefined || email.value === undefined) {
        return;
    }

    const success =
        props.user === undefined
            ? await apiPost<boolean>('/users/api/users/', {
                  name: name.value,
                  email: email.value,
                  password: password.value,
                  passwordRepeated: passwordRepeated.value,
                  role: role.value,
              } satisfies UserCreateApiData)
            : await apiPatch<boolean>('/users/api/users/', {
                  id: props.user.id,
                  name: name.value,
                  email: email.value,
              } satisfies UserEditApiData);

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
        'Name': 'Name',
        'Password': 'Password',
        'Repeat Password': 'Repeat Password',
        'Role': 'Role',
        'Teacher': 'Teacher',
        'Add': 'Add',
        'Save': 'Save',
        'Adding new user failed.': 'Adding new user failed.',
        'User with that email already exists.': 'User with that email already exists.',
    },
    'pl': {
        'Name': 'Nazwa',
        'Password': 'Hasło',
        'Repeat Password': 'Powtórz Hasło',
        'Role': 'Rola',
        'Teacher': 'Nauczyciel',
        'Add': 'Dodaj',
        'Save': 'Zapisz',
        'Adding new user failed.': 'Dodawanie nowego użytkownika nie powiodło się.',
        'User with that email already exists.': 'Użytkownik o tym adresie e-mail już istnieje.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" autocomplete="off" @submit.prevent="submit">
        <div>
            <label for="name" class="form-label">{{ translate('Name') }}</label>
            <input
                id="name"
                v-model="name"
                type="text"
                class="form-control"
                :placeholder="translate('Name')"
                required
            />
        </div>

        <div>
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>

        <div v-if="!isEditing">
            <label for="password" class="form-label">{{ translate('Password') }}</label>
            <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                :placeholder="translate('Password')"
                required
                autocomplete="new-password"
            />
        </div>

        <div v-if="!isEditing">
            <label for="passwordRepeated" class="form-label">{{ translate('Repeat Password') }}</label>
            <input
                id="passwordRepeated"
                v-model="passwordRepeated"
                type="password"
                class="form-control"
                :placeholder="translate('Repeat Password')"
                required
            />
        </div>

        <div v-if="!isEditing">
            <label for="role" class="form-label">{{ translate('Role') }}</label>
            <select id="role" v-model="role" class="form-select" required>
                <option value="teacher">{{ translate('Teacher') }}</option>
                <option value="admin">Admin</option>
            </select>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(isEditing ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate(isEditing ? 'User with that email already exists.' : 'Adding new user failed.') }}
        </div>
    </form>
    <br />
</template>
