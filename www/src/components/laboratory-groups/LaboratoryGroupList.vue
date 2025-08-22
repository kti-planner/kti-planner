<script setup lang="ts">
import { inject, ref, useId, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPost, useApiFetch } from '@components/api';
import { isLoggedInKey } from '@components/is-logged-in';
import type { LaboratoryGroupCreateApiData, LaboratoryGroupData } from '@components/laboratory-groups/types';

const translations = {
    'en': {
        'Laboratory groups': 'Laboratory groups',
        'New group': 'New group',
        'Add': 'Add',
        'This group already exists': 'This group already exists',
    },
    'pl': {
        'Laboratory groups': 'Grupy laboratoryjne',
        'New group': 'Nowa grupa',
        'Add': 'Dodaj',
        'This group already exists': 'Ta grupa już istnieje',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { apiUrl } = defineProps<{
    apiUrl: string;
}>();

const isLoggedIn = inject(isLoggedInKey, false);

const { data: groups, execute: refreshGroups } = useApiFetch<LaboratoryGroupData[]>(apiUrl, { clone: true });

const newGroupName = ref('');
const addingFailed = ref(false);

watch(newGroupName, () => (addingFailed.value = false));

async function addGroup() {
    if (newGroupName.value === '' || !groups.value) {
        return;
    }

    addingFailed.value = false;

    const group = await apiPost<LaboratoryGroupData | null>(apiUrl, {
        name: newGroupName.value,
    } satisfies LaboratoryGroupCreateApiData);

    if (group === undefined) {
        return;
    }

    addingFailed.value = group === null;

    if (group !== null) {
        newGroupName.value = '';
        groups.value.push(group);
        groups.value.sort((a, b) => a.name.localeCompare(b.name));
    }

    void refreshGroups();
}

const addBtnId = useId();
</script>

<template>
    <h2 class="text-center fs-5">
        {{ translate('Laboratory groups') }}
    </h2>
    <div v-if="groups && groups.length > 0" class="d-flex flex-wrap gap-2 mb-3">
        <button v-for="group in groups" :key="group.id" type="button" class="btn btn-light">{{ group.name }}</button>
    </div>
    <form v-if="isLoggedIn" @submit.prevent="addGroup">
        <div class="input-group">
            <input
                v-model.trim="newGroupName"
                type="text"
                class="form-control"
                :class="{
                    'border': addingFailed,
                    'border-danger': addingFailed,
                }"
                :placeholder="translate('New group')"
                required
                :aria-label="translate('New group')"
                :aria-describedby="addBtnId"
                :aria-invalid="addingFailed"
            />
            <button
                :id="addBtnId"
                class="btn btn-success"
                type="submit"
                :title="translate('Add')"
                :disabled="newGroupName === ''"
            >
                <i class="bi bi-plus-lg"></i>
            </button>
        </div>
        <p v-if="addingFailed" class="text-danger mt-2">
            {{ translate('This group already exists') }}
        </p>
    </form>
</template>
