<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import { toHyphenatedLowercase } from '@components/utils';

const props = defineProps<{
    semester: SemesterData;
    subject?: SubjectData;
}>();

const isEditing = computed(() => props.subject !== undefined);

const addingFailed = ref(false);

const subjectName = ref<string | undefined>(props.subject?.name);

async function submit() {
    try {
        const result = !isEditing.value
            ? await fetch('/semesters/api/subjects/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      name: subjectName.value,
                      semesterId: props.semester.id,
                  }),
              })
            : await fetch('/semesters/api/subjects/', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      id: props.subject?.id,
                      name: subjectName.value,
                  }),
              });

        if (!result.ok) {
            console.error('API request failed!');
            return;
        }

        const addingSuccess = (await result.json()) as boolean;
        addingFailed.value = !addingSuccess;

        if (addingSuccess) {
            const newUrl = `/semesters/${props.semester.slug}/${toHyphenatedLowercase(subjectName.value ?? '')}/`;

            if (isEditing.value) {
                window.history.replaceState({}, '', newUrl);
                window.location.reload();
            } else {
                window.location.assign(newUrl);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const translations = {
    'en': {
        'Subject name': 'Subject name',
        'Save': 'Save',
        'Add': 'Add',
        'Subject with this name already exists.': 'Subject with this name already exists.',
    },
    'pl': {
        'Subject name': 'Nazwa przedmiotu',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Subject with this name already exists.': 'Przedmiot o podanej nazwie już isnieje.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="subjectName" class="form-label">{{ translate('Subject name') }}</label>
            <input id="subjectName" v-model="subjectName" type="text" class="form-control" required autofocus />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(isEditing ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="addingFailed" class="text-center text-danger">
            {{ translate('Subject with this name already exists.') }}
        </div>
    </form>
</template>
