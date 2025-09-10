<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch, apiPost } from '@components/api';
import type { SemesterCreateApiData, SemesterData, SemesterEditApiData } from '@components/semesters/types';

const props = defineProps<{
    semester?: SemesterData;
}>();

const submitFailed = ref(false);

const type = ref<'summer' | 'winter' | undefined>(props.semester?.type);
const year = ref<number | undefined>(props.semester?.year);
const startDate = ref<string | undefined>(props.semester?.startDate);
const endDate = ref<string | undefined>(props.semester?.endDate);

async function submit() {
    if (
        type.value === undefined ||
        year.value === undefined ||
        startDate.value === undefined ||
        endDate.value === undefined
    ) {
        return;
    }

    const success =
        props.semester === undefined
            ? await apiPost<boolean>('/semesters/api/semesters/', {
                  type: type.value,
                  year: year.value,
                  startDate: startDate.value,
                  endDate: endDate.value,
              } satisfies SemesterCreateApiData)
            : await apiPatch<boolean>('/semesters/api/semesters/', {
                  id: props.semester.id,
                  type: type.value,
                  year: year.value,
                  startDate: startDate.value,
                  endDate: endDate.value,
              } satisfies SemesterEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        window.location.assign(`/semesters/${year.value}-${type.value}/`);
    }
}

const translations = {
    'en': {
        'Semester type': 'Semester type',
        'Winter semester': 'Winter semester',
        'Summer semester': 'Summer semester',
        'Academic year': 'Academic year',
        'Semester start date': 'Semester start date',
        'Semester end date': 'Semester end date',
        'Edit holidays and schedule changes': 'Edit holidays and schedule changes',
        'Save': 'Save',
        'Add': 'Add',
        'Semester with this year and type already exists.': 'Semester with this year and type already exists.',
    },
    'pl': {
        'Semester type': 'Rodzaj semestru',
        'Winter semester': 'Semestr zimowy',
        'Summer semester': 'Semestr letni',
        'Academic year': 'Rok rozpoczęcia roku akademickiego',
        'Semester start date': 'Data rozpoczęcia semestru',
        'Semester end date': 'Data zakończenia semestru',
        'Edit holidays and schedule changes': 'Edytuj dni wolne i zmiany planu',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Semester with this year and type already exists.': 'Semestr o podanym roku i rodzaju już istnieje.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const typeId = crypto.randomUUID();
const yearId = crypto.randomUUID();
const startId = crypto.randomUUID();
const endId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="typeId" class="form-label">{{ translate('Semester type') }}</label>
            <select :id="typeId" v-model="type" class="form-select" required>
                <option value="winter">{{ translate('Winter semester') }}</option>
                <option value="summer">{{ translate('Summer semester') }}</option>
            </select>
        </div>

        <div>
            <label :for="yearId" class="form-label">{{ translate('Academic year') }}</label>
            <input :id="yearId" v-model="year" type="number" class="form-control" required />
        </div>

        <div>
            <label :for="startId" class="form-label">{{ translate('Semester start date') }}</label>
            <input :id="startId" v-model="startDate" type="date" class="form-control" required />
        </div>

        <div>
            <label :for="endId" class="form-label">{{ translate('Semester end date') }}</label>
            <input :id="endId" v-model="endDate" type="date" class="form-control" required />
        </div>

        <div v-if="semester">
            <a :href="`/semesters/${semester.slug}/schedule-changes/`" target="_blank" class="link-success">
                {{ translate('Edit holidays and schedule changes') }}
            </a>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(semester ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Semester with this year and type already exists.') }}
        </div>
    </form>
</template>
