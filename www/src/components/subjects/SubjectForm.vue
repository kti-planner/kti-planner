<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch, apiPost } from '@components/api';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectCreateApiData, SubjectData, SubjectEditApiData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import { toHyphenatedLowercase } from '@components/utils';
import UserMultiSelector from '@components/users/UserMultiSelector.vue';

const props = defineProps<{
    semester: SemesterData;
    subject?: SubjectData;
    allUsers: UserData[];
}>();

const isEditing = computed(() => props.subject !== undefined);

const submitFailed = ref(false);

const subjectName = ref<string>(props.subject?.name ?? '');
const teachers = ref<UserData[]>(props.subject?.teachers ?? []);

async function submit() {
    const success =
        props.subject === undefined
            ? await apiPost<boolean>('/semesters/api/subjects/', {
                  name: subjectName.value,
                  semesterId: props.semester.id,
                  teacherIds: teachers.value.map(user => user.id),
              } satisfies SubjectCreateApiData)
            : await apiPatch<boolean>('/semesters/api/subjects/', {
                  id: props.subject.id,
                  name: subjectName.value,
                  teacherIds: teachers.value.map(user => user.id),
              } satisfies SubjectEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        const newUrl = `/semesters/${props.semester.slug}/${toHyphenatedLowercase(subjectName.value ?? '')}/`;

        if (isEditing.value) {
            window.history.replaceState({}, '', newUrl);
            window.location.reload();
        } else {
            window.location.assign(newUrl);
        }
    }
}

const translations = {
    'en': {
        'Subject name': 'Subject name',
        'Teachers': 'Teachers',
        'Save': 'Save',
        'Add': 'Add',
        'Subject with this name already exists.': 'Subject with this name already exists.',
    },
    'pl': {
        'Subject name': 'Nazwa przedmiotu',
        'Teachers': 'Nauczyciele',
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

        <div>
            <label for="subjectTeachers" class="form-label">{{ translate('Teachers') }}</label>
            <UserMultiSelector id="subjectTeachers" v-model="teachers" :options="allUsers" required />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(isEditing ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Subject with this name already exists.') }}
        </div>
    </form>
</template>
