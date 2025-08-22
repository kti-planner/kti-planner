<script setup lang="ts">
import { ref } from 'vue';
import type { UserRole } from '@backend/user';
import { langId } from '@components/frontend/lang';
import { apiPatch } from '@components/api';
import type { UserData, UserEditRoleApiData } from '@components/users/types';

const props = defineProps<{
    user: UserData;
}>();

const role = ref<UserRole>(props.user.role);

async function submit() {
    const success = await apiPatch<boolean>('/users/api/roles/', {
        id: props.user?.id,
        role: role.value,
    } satisfies UserEditRoleApiData);

    if (success === undefined) {
        return;
    }

    if (success) {
        window.location.reload();
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
        'Teacher': 'Nauczyciel',
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
