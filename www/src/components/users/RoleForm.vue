<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import type { UserData } from '@components/users/types';

const props = defineProps<{
    user: UserData;
}>();

const editFailed = ref<boolean>(false);

const role = ref<string>(props.user.role);

async function submit() {
    try {
        const result = await fetch('/users/api/roles/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: props.user?.id,
                role: role.value,
            }),
        });

        if (!result.ok) {
            console.error('API request failed!');
            return;
        }

        const editSuccess = (await result.json()) as boolean;
        editFailed.value = !editSuccess;

        if (editSuccess) {
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

const translations = {
    'en': {
        'Role': 'Role',
        'Teacher': 'Teacher',
        'Admin': 'Admin',
        'Save': 'Save',
    },
    'pl': {
        'Role': 'Rola',
        'Teacher': 'Prowadzący',
        'Admin': 'Admin',
        'Save': 'Zapisz',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="role" class="form-label">{{ translate('Role') }}</label>
            <select id="role" v-model="role" class="form-select" required>
                <option value="teacher">{{ translate('Teacher') }}</option>
                <option value="admin">{{ translate('Admin') }}</option>
            </select>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Save') }}</button>
        </div>
    </form>
    <br />
</template>
