<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiGet, apiPost } from '@components/api';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectCopyFromPreviousSemesterApiData, SubjectData } from '@components/subjects/types';

const { currentSemester } = defineProps<{
    currentSemester: SemesterData;
}>();

const submitFailed = ref(false);

const semestersData = ref<SemesterData[]>([]);
const subjectsData = ref<SubjectData[]>([]);

const selectedSemester = ref<SemesterData | undefined>(undefined);
const selectedSubject = ref<SubjectData | undefined>(undefined);

async function submit() {
    if (selectedSemester.value === undefined || selectedSubject.value === undefined) {
        return;
    }

    const success = await apiPost<boolean>(`/semesters/${currentSemester.slug}/api/subject-copy/`, {
        semesterId: selectedSemester.value.id,
        subjectId: selectedSubject.value.id,
    } satisfies SubjectCopyFromPreviousSemesterApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        window.location.reload();
    }
}

onMounted(async () => {
    const data = await apiGet<SemesterData[]>('/semesters/api/semesters/');
    if (data !== undefined) {
        semestersData.value = data.filter(semester => semester.slug !== currentSemester.slug);

        selectedSemester.value = semestersData.value.find(
            s => s.year === currentSemester.year - 1 && s.type === currentSemester.type,
        );
    }
});

watch(selectedSemester, async newSemester => {
    if (newSemester) {
        selectedSubject.value = undefined;
        const data = await apiGet<SubjectData[]>(`/semesters/${newSemester.slug}/api/subjects/`);
        if (data !== undefined) {
            subjectsData.value = data;
        }
    }
});

const translations = {
    'en': {
        'Subject will be copied along with all its:': 'Subject will be copied along with all its:',
        'Exercises': 'Exercises',
        'Laboratory groups': 'Laboratory groups',
        "Calendar events won't be copied.": "Calendar events won't be copied.",
        'Semester to copy from': 'Semester to copy from',
        'Summer semester': 'Summer semester',
        'Winter semester': 'Winter semester',
        'Select a semester to see available subjects to copy.': 'Select a semester to see available subjects to copy.',
        'Subject to copy': 'Subject to copy',
        'Copy': 'Copy',
        'Subject with this name already exists.': 'Subject with this name already exists.',
    },
    'pl': {
        'Subject will be copied along with all its:': 'Przedmiot zostanie skopiowany wraz ze wszystkimi jego:',
        'Exercises': 'Ćwiczeniami',
        'Laboratory groups': 'Grupami laboratoryjnymi',
        "Calendar events won't be copied.": 'Wydarzenia kalendarza nie zostaną skopiowane.',
        'Semester to copy from': 'Semestr, z którego chcesz skopiować',
        'Summer semester': 'Semestr letni',
        'Winter semester': 'Semestr zimowy',
        'Select a semester to see available subjects to copy.':
            'Wybierz semestr, aby zobaczyć dostępne przedmioty do skopiowania.',
        'Subject to copy': 'Przedmiot do skopiowania',
        'Copy': 'Kopiuj',
        'Subject with this name already exists.': 'Przedmiot o tej nazwie już istnieje.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const semesterId = crypto.randomUUID();
const subjectId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            {{ translate('Subject will be copied along with all its:') }}
            <ul>
                <li>{{ translate('Exercises') }}</li>
                <li>{{ translate('Laboratory groups') }}</li>
            </ul>
            {{ translate("Calendar events won't be copied.") }}
        </div>

        <div>
            <label :for="semesterId" class="form-label">{{ translate('Semester to copy from') }}</label>
            <select :id="semesterId" v-model="selectedSemester" class="form-select" required>
                <option v-for="semester in semestersData" :key="semester.slug" :value="semester">
                    {{
                        `${
                            semester.type === 'summer' ? translate('Summer semester') : translate('Winter semester')
                        } ${semester.year}/${semester.year + 1}`
                    }}
                </option>
            </select>
        </div>

        <div>
            <p v-if="!selectedSemester">
                {{ translate('Select a semester to see available subjects to copy.') }}
            </p>
            <p v-else>
                <label :for="subjectId" class="form-label">{{ translate('Subject to copy') }}</label>
                <select :id="subjectId" v-model="selectedSubject" class="form-select" required>
                    <option v-for="subject in subjectsData" :key="subject.slug" :value="subject">
                        {{ subject.name }}
                    </option>
                </select>
            </p>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Copy') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Subject with this name already exists.') }}
        </div>
    </form>
</template>
