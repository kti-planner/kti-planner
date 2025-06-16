<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import type { SemesterData } from '@components/semesters/types';

const props = defineProps<{
    semester?: SemesterData;
}>();

const addingFailed = ref(false);

const type = ref<'summer' | 'winter' | undefined>(props.semester?.type);
const year = ref<number | undefined>(props.semester?.year);
const startDate = ref<string | undefined>(props.semester?.startDate);
const endDate = ref<string | undefined>(props.semester?.endDate);

async function submit() {
    try {
        const result =
            props.semester === undefined
                ? await fetch('/semesters/api/semesters/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          type: type.value,
                          year: year.value,
                          startDate: startDate.value,
                          endDate: endDate.value,
                      }),
                  })
                : await fetch('/semesters/api/semesters/', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          id: props.semester.id,
                          type: type.value,
                          year: year.value,
                          startDate: startDate.value,
                          endDate: endDate.value,
                      }),
                  });

        if (!result.ok) {
            console.error('API request failed!');
            return;
        }

        const addingSuccess = (await result.json()) as boolean;
        addingFailed.value = !addingSuccess;

        if (addingSuccess) {
            window.location.assign(`/semesters/${type.value}-${year.value}/`);
        }
    } catch (error) {
        console.log(error);
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
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Semester with this year and type already exists.': 'Semestr o podanym roku i rodzaju już istnieje.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form @submit.prevent="submit" class="vstack gap-3 mx-auto" style="max-width: 500px">
        <div>
            <label for="type" class="form-label">{{ translate('Semester type') }}</label>
            <select v-model="type" id="type" class="form-select" required>
                <option value="winter">{{ translate('Winter semester') }}</option>
                <option value="summer">{{ translate('Summer semester') }}</option>
            </select>
        </div>

        <div>
            <label for="year" class="form-label">{{ translate('Academic year') }}</label>
            <input v-model="year" type="number" id="year" class="form-control" required />
        </div>

        <div>
            <label for="startDate" class="form-label">{{ translate('Semester start date') }}</label>
            <input v-model="startDate" type="date" id="startDate" class="form-control" required />
        </div>

        <div>
            <label for="endDate" class="form-label">{{ translate('Semester end date') }}</label>
            <input v-model="endDate" type="date" id="endDate" class="form-control" required />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(semester ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="addingFailed" class="text-center text-danger">
            {{ translate('Semester with this year and type already exists.') }}
        </div>
    </form>
</template>
