<script setup lang="ts">
import { computed, inject, ref, useId, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch, apiPost, useApiFetch } from '@components/api';
import { isLoggedInKey } from '@components/is-logged-in';
import type {
    LaboratoryGroupCreateApiData,
    LaboratoryGroupData,
    LaboratoryGroupEditApiData,
} from '@components/laboratory-groups/types';

const translations = {
    'en': {
        'Laboratory groups': 'Laboratory groups',
        'New group': 'New group',
        'Edit name': 'Edit name',
        'Add': 'Add',
        'Save': 'Save',
        'This group already exists': 'This group already exists',
    },
    'pl': {
        'Laboratory groups': 'Grupy laboratoryjne',
        'New group': 'Nowa grupa',
        'Edit name': 'Edytuj nazwę',
        'Add': 'Dodaj',
        'Save': 'Zapisz',
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

const groupName = ref('');
const submitFailed = ref(false);
const selectedGroupIds = ref(new Set<string>());

const selectedGroups = computed<LaboratoryGroupData[] | null>(
    () => groups.value?.filter(g => selectedGroupIds.value.has(g.id)) ?? null,
);

const isAdding = computed<boolean>(() => selectedGroupIds.value.size !== 1);

watch(groupName, () => (submitFailed.value = false));

watch(groups, () => {
    selectedGroupIds.value.forEach(id => {
        if (!groups.value?.some(g => g.id === id)) {
            selectedGroupIds.value.delete(id);
        }
    });
});

watch(isAdding, () => (groupName.value = ''));

async function addGroup() {
    if (groupName.value === '' || !groups.value) {
        return;
    }

    submitFailed.value = false;

    const group = await apiPost<LaboratoryGroupData | null>(apiUrl, {
        name: groupName.value,
    } satisfies LaboratoryGroupCreateApiData);

    if (group === undefined) {
        return;
    }

    submitFailed.value = group === null;

    if (group !== null) {
        groupName.value = '';
        groups.value.push(group);
        groups.value.sort((a, b) => a.name.localeCompare(b.name));
    }

    void refreshGroups();
}

async function editGroup(group: LaboratoryGroupData) {
    if (groupName.value === '' || !groups.value) {
        return;
    }

    submitFailed.value = false;

    const success = await apiPatch<boolean>(apiUrl, {
        id: group.id,
        name: groupName.value,
    } satisfies LaboratoryGroupEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        groups.value = groups.value.map(g => (g.id === group.id ? { id: g.id, name: groupName.value } : g));
        groups.value.sort((a, b) => a.name.localeCompare(b.name));
        groupName.value = '';
    }

    void refreshGroups();
}

function toggleSelectGroup(group: LaboratoryGroupData) {
    if (selectedGroupIds.value.has(group.id)) {
        selectedGroupIds.value.delete(group.id);
    } else {
        selectedGroupIds.value.add(group.id);
    }
}

const submitBtnId = useId();
</script>

<template>
    <h2 class="text-center fs-5">
        {{ translate('Laboratory groups') }}
    </h2>
    <div v-if="groups && groups.length > 0" class="d-flex flex-wrap gap-2 mb-3">
        <button
            v-for="group in groups"
            :key="group.id"
            type="button"
            class="btn"
            :class="selectedGroupIds.has(group.id) ? 'btn-success' : 'btn-light'"
            @click="toggleSelectGroup(group)"
        >
            {{ group.name }}
        </button>
    </div>
    <form v-if="isLoggedIn" @submit.prevent="isAdding ? addGroup() : editGroup(selectedGroups![0]!)">
        <div class="input-group">
            <input
                v-model.trim="groupName"
                type="text"
                class="form-control"
                :class="{
                    'border': submitFailed,
                    'border-danger': submitFailed,
                }"
                :placeholder="isAdding ? translate('New group') : translate('Edit name')"
                required
                :aria-label="isAdding ? translate('New group') : translate('Edit name')"
                :aria-describedby="submitBtnId"
                :aria-invalid="submitFailed"
            />
            <button
                :id="submitBtnId"
                class="btn btn-success"
                type="submit"
                :title="isAdding ? translate('Add') : translate('Save')"
                :disabled="groupName === ''"
            >
                <i class="bi" :class="isAdding ? 'bi-plus-lg' : 'bi-pencil-fill'"></i>
            </button>
        </div>
        <p v-if="submitFailed" class="text-danger mt-2">
            {{ translate('This group already exists') }}
        </p>
    </form>
</template>
