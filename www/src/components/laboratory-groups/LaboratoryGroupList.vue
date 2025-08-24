<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { apiPatch, apiPost, useApiFetch } from '@components/api';
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
        'Add group': 'Add group',
        'Save group name': 'Save group name',
        'This group already exists': 'This group already exists',
    },
    'pl': {
        'Laboratory groups': 'Grupy laboratoryjne',
        'New group': 'Nowa grupa',
        'Edit name': 'Edytuj nazwę',
        'Add group': 'Dodaj grupę',
        'Save group name': 'Zapisz nazwę grupy',
        'This group already exists': 'Ta grupa już istnieje',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { apiUrl } = defineProps<{
    apiUrl: string;
}>();

const { data: groups, execute: refreshGroups } = useApiFetch<LaboratoryGroupData[]>(apiUrl, { clone: true });

const groupName = ref('');
const submitFailed = ref(false);
const selectedGroupIds = ref(new Set<string>());

const selectedGroups = computed<LaboratoryGroupData[]>(() =>
    (groups.value ?? []).filter(group => selectedGroupIds.value.has(group.id)),
);

const isAdding = computed<boolean>(() => selectedGroups.value.length !== 1);

watch(groupName, () => (submitFailed.value = false));
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

const submitBtnId = useId();
</script>

<template>
    <div>
        <h2 class="text-center fs-5">
            {{ translate('Laboratory groups') }}
        </h2>
        <div v-if="groups && groups.length > 0" class="d-flex flex-wrap gap-2 mb-3">
            <template v-for="group in groups" :key="group.id">
                <input
                    :id="group.id"
                    v-model="selectedGroupIds"
                    :value="group.id"
                    type="checkbox"
                    class="btn-check"
                    autocomplete="off"
                />
                <label
                    class="btn group-btn"
                    :class="selectedGroupIds.has(group.id) ? 'btn-success' : 'btn-light'"
                    :for="group.id"
                    >{{ group.name }}</label
                >
            </template>
        </div>
        <form
            v-if="currentUser !== null"
            @submit.prevent="isAdding || selectedGroups[0] === undefined ? addGroup() : editGroup(selectedGroups[0])"
        >
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
                    :title="isAdding ? translate('Add group') : translate('Save group name')"
                    :aria-label="isAdding ? translate('Add group') : translate('Save group name')"
                    :disabled="groupName === ''"
                >
                    <i class="bi" :class="isAdding ? 'bi-plus-lg' : 'bi-pencil-fill'"></i>
                </button>
            </div>
            <p v-if="submitFailed" class="text-danger mt-2">
                {{ translate('This group already exists') }}
            </p>
        </form>
    </div>
</template>

<style scoped lang="scss">
.group-btn:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}
</style>
