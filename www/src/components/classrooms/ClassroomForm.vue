<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch, apiPost } from '@components/api';
import type { ClassroomData } from '@components/classrooms/types';

const props = defineProps<{
    classroom?: ClassroomData;
}>();

const submitFailed = ref(false);

const name = ref<string | undefined>(props.classroom?.name);

async function submit() {
    const success =
        props.classroom === undefined
            ? await apiPost<boolean>('/classrooms/api/', { name: name.value })
            : await apiPatch<boolean>('/classrooms/api/', { id: props.classroom.id, name: name.value });

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
        'Classroom name': 'Classroom name',
        'Save': 'Save',
        'Add': 'Add',
        'Classroom with this name already exists': 'Classroom with this name already exists',
    },
    'pl': {
        'Classroom name': 'Nazwa sali',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Classroom with this name already exists': 'Sala z tą nazwą już istnieje',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="classroomName" class="form-label">{{ translate('Classroom name') }}</label>
            <input id="classroomName" v-model="name" type="text" class="form-control" required />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(classroom ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Classroom with this name already exists') }}
        </div>
    </form>
</template>
