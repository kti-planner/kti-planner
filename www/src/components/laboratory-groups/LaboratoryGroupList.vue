<script setup lang="ts">
import { computed, ref, useId, watch, watchEffect } from 'vue';
import { useSorted } from '@vueuse/core';
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

const model = defineModel<LaboratoryGroupData[]>({ required: true });

const { apiUrl } = defineProps<{
    apiUrl: string;
}>();

const { data: groups, execute: refreshGroups } = useApiFetch<LaboratoryGroupData[]>(apiUrl, { clone: true });
const nonNullGroups = computed<LaboratoryGroupData[]>(() => groups.value ?? []);
const sortedGroups = useSorted<LaboratoryGroupData>(nonNullGroups, (a, b) => a.name.localeCompare(b.name));

const groupName = ref('');
const submitFailed = ref(false);
const selectedGroupIds = ref(new Set<string>());

const selectedGroups = computed<LaboratoryGroupData[]>(() =>
    (groups.value ?? []).filter(group => selectedGroupIds.value.has(group.id)),
);

const isAdding = computed<boolean>(() => selectedGroups.value.length !== 1);

watch(groupName, () => (submitFailed.value = false));
watch(isAdding, () => (groupName.value = ''));

watchEffect(() => {
    model.value = selectedGroups.value;
});

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
        groupName.value = '';
    }

    void refreshGroups();
}

const submitBtnId = useId();
const invalidFeedbackId = useId();
</script>

<template>
    <div>
        <h2 class="text-center fs-5">
            {{ translate('Laboratory groups') }}
        </h2>
        <div v-if="groups && groups.length > 0" class="d-flex flex-wrap gap-2 mb-3">
            <template v-for="group in sortedGroups" :key="group.id">
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
            <div class="input-group has-validation">
                <input
                    v-model.trim="groupName"
                    type="text"
                    class="form-control"
                    :class="{
                        'is-invalid': submitFailed,
                    }"
                    :placeholder="isAdding ? translate('New group') : translate('Edit name')"
                    required
                    :aria-label="isAdding ? translate('New group') : translate('Edit name')"
                    :aria-describedby="`${submitBtnId} ${invalidFeedbackId}`"
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
                <div v-if="submitFailed" :id="invalidFeedbackId" class="invalid-feedback">
                    {{ translate('This group already exists') }}
                </div>
            </div>
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
