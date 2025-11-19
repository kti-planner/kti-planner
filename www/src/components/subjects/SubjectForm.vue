<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { stringToHexColor } from 'src/utils';
import type { StudyCycleType, StudyModeType } from '@backend/subject';
import { langId } from '@components/frontend/lang';
import { apiDelete, apiPatch, apiPost } from '@components/api';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectCreateApiData, SubjectData, SubjectEditApiData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import { makeSubjectFullName, romanNumerals, toHyphenatedLowercase } from '@components/utils';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';
import ColorPicker from '@components/ColorPicker.vue';
import UserMultiSelector from '@components/users/UserMultiSelector.vue';

const { semester, subject } = defineProps<{
    semester: SemesterData;
    subject?: SubjectData;
    allUsers: UserPublicData[];
}>();

const isEditing = computed(() => subject !== undefined);

const submitFailed = ref(false);

const subjectName = ref<string>(subject?.name ?? '');
const moodleCourseId = ref<string>(subject?.moodleCourseId ?? '');
const description = ref<string>(subject?.description ?? '');
const teachers = ref<UserPublicData[]>(subject?.teachers ?? []);

const durationMinutes = ref<105 | 165 | 'custom' | null>(
    !subject || subject.durationMinutes === null
        ? null
        : subject.durationMinutes === 105 || subject.durationMinutes === 165
          ? subject.durationMinutes
          : 'custom',
);

const customDurationMinutes = ref<number | string>(subject?.durationMinutes ?? 105);
const classRepeatWeeks = ref<number | string>(subject?.classRepeatWeeks ?? 1);
const studyMode = ref<StudyModeType>(subject?.studyMode ?? 'full-time');
const studyCycle = ref<StudyCycleType>(subject?.studyCycle ?? 'first-cycle');
const semesterNumber = ref<number>(subject?.semesterNumber ?? 1);
const color = ref<string>(subject?.color ?? '#000000');

watch([subjectName, semesterNumber], () => {
    color.value = stringToHexColor(makeSubjectFullName(subjectName.value, semesterNumber.value));
});

function restoreColor() {
    if (subject?.color) {
        color.value = subject.color;
    } else {
        color.value = stringToHexColor(makeSubjectFullName(subjectName.value, semesterNumber.value));
    }
}

async function submit() {
    if (typeof customDurationMinutes.value === 'string' || typeof classRepeatWeeks.value === 'string') {
        return;
    }

    const success =
        subject === undefined
            ? await apiPost<boolean>('/api/subjects/', {
                  name: subjectName.value,
                  semesterId: semester.id,
                  teacherIds: teachers.value.map(user => user.id),
                  description: description.value,
                  moodleCourseId: moodleCourseId.value,
                  durationMinutes:
                      durationMinutes.value === 'custom' ? customDurationMinutes.value : durationMinutes.value,
                  classRepeatWeeks: classRepeatWeeks.value,
                  studyMode: studyMode.value,
                  studyCycle: studyCycle.value,
                  semesterNumber: semesterNumber.value,
                  color: color.value,
              } satisfies SubjectCreateApiData)
            : await apiPatch<boolean>(`/api/subjects/${subject.id}/`, {
                  name: subjectName.value,
                  teacherIds: teachers.value.map(user => user.id),
                  description: description.value,
                  moodleCourseId: moodleCourseId.value,
                  durationMinutes:
                      durationMinutes.value === 'custom' ? customDurationMinutes.value : durationMinutes.value,
                  classRepeatWeeks: classRepeatWeeks.value,
                  studyMode: studyMode.value,
                  studyCycle: studyCycle.value,
                  semesterNumber: semesterNumber.value,
                  color: color.value,
              } satisfies SubjectEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        const newUrl = `/semesters/${semester.slug}/subjects/${toHyphenatedLowercase(makeSubjectFullName(subjectName.value, semesterNumber.value))}/`;

        if (isEditing.value) {
            window.history.replaceState({}, '', newUrl);
            window.location.reload();
        } else {
            window.location.assign(newUrl);
        }
    }
}

async function doDelete() {
    if (!subject) {
        return;
    }

    const result = await apiDelete<boolean>(`/api/subjects/${subject.id}/`);

    if (result) {
        window.location.assign(`/semesters/${semester.slug}/`);
    }
}

const translations = {
    'en': {
        'Subject name': 'Subject name',
        'Moodle course ID': 'Moodle course ID',
        'Description': 'Description',
        'Teachers': 'Teachers',
        'Save': 'Save',
        'Add': 'Add',
        'Subject with this name already exists.': 'Subject with this name already exists.',
        'Markdown is supported': 'Markdown is supported',
        'Delete subject': 'Delete subject',
        'Class duration': 'Class duration',
        'Custom': 'Custom',
        'Variable': 'Variable',
        'How many weeks are between classes?': 'How many weeks are between classes?',
        'Study mode': 'Study mode',
        'Full-time': 'Full-time',
        'Part-time': 'Part-time',
        'Study cycle': 'Study cycle',
        'First-cycle': 'First-cycle',
        'Second-cycle': 'Second-cycle',
        'Semester': 'Semester',
        'Color': 'Color',
    },
    'pl': {
        'Subject name': 'Nazwa przedmiotu',
        'Moodle course ID': 'ID kursu Moodle',
        'Description': 'Opis',
        'Teachers': 'Nauczyciele',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Subject with this name already exists.': 'Przedmiot o podanej nazwie już istnieje.',
        'Markdown is supported': 'Markdown jest wspierany',
        'Delete subject': 'Usuń przedmiot',
        'Class duration': 'Czas trwania zajęć',
        'Custom': 'Niestandardowy',
        'Variable': 'Zmienny',
        'How many weeks are between classes?': 'Co ile tygodni zajęcia się powtarzają?',
        'Study mode': 'Tryb studiów',
        'Full-time': 'Stacjonarny',
        'Part-time': 'Niestacjonarny',
        'Study cycle': 'Stopień studiów',
        'First-cycle': 'Pierwszy stopień',
        'Second-cycle': 'Drugi stopień',
        'Semester': 'Semestr',
        'Color': 'Kolor',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const nameId = crypto.randomUUID();
const moodleCourseInputId = crypto.randomUUID();
const descriptionId = crypto.randomUUID();
const teachersId = crypto.randomUUID();
const durationId = crypto.randomUUID();
const classRepeatId = crypto.randomUUID();
const studyModeId = crypto.randomUUID();
const studyCycleId = crypto.randomUUID();
const semesterNumberId = crypto.randomUUID();
const colorId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="nameId" class="form-label">
                {{ translate('Subject name') }} <span class="text-danger">*</span>
            </label>
            <input
                :id="nameId"
                v-model="subjectName"
                type="text"
                class="form-control"
                placeholder="Sieci komputerowe - Informatyka"
                required
                autofocus
            />
        </div>

        <div>
            <label :for="studyModeId" class="form-label">
                {{ translate('Study mode') }} <span class="text-danger">*</span>
            </label>
            <select
                :id="studyModeId"
                v-model="studyMode"
                class="form-select"
                :aria-label="translate('Study mode')"
                required
            >
                <option value="full-time">{{ translate('Full-time') }}</option>
                <option value="part-time">{{ translate('Part-time') }}</option>
            </select>
        </div>

        <div>
            <label :for="studyCycleId" class="form-label">
                {{ translate('Study cycle') }} <span class="text-danger">*</span>
            </label>
            <select
                :id="studyCycleId"
                v-model="studyCycle"
                class="form-select"
                :aria-label="translate('Study cycle')"
                required
            >
                <option value="first-cycle">{{ translate('First-cycle') }}</option>
                <option value="second-cycle">{{ translate('Second-cycle') }}</option>
            </select>
        </div>

        <div>
            <label :for="semesterNumberId" class="form-label">
                {{ translate('Semester') }} <span class="text-danger">*</span>
            </label>
            <select
                :id="semesterNumberId"
                v-model="semesterNumber"
                class="form-select"
                :aria-label="translate('Semester')"
                required
            >
                <option v-for="(romanNumeral, index) in romanNumerals" :key="romanNumeral" :value="index + 1">
                    {{ romanNumeral }}
                </option>
            </select>
        </div>

        <div>
            <label :for="colorId" class="form-label">{{ translate('Color') }}</label>
            <ColorPicker :id="colorId" v-model="color" @restore-color="restoreColor()" />
        </div>

        <div>
            <label :for="moodleCourseInputId" class="form-label">
                {{ translate('Moodle course ID') }}
            </label>
            <input :id="moodleCourseInputId" v-model="moodleCourseId" type="text" class="form-control" />
        </div>

        <div>
            <label :for="descriptionId" class="form-label">
                {{ translate('Description') }}
            </label>
            <textarea
                :id="descriptionId"
                v-model="description"
                class="form-control"
                :placeholder="translate('Markdown is supported')"
            ></textarea>
        </div>

        <div>
            <label :for="teachersId" class="form-label">
                {{ translate('Teachers') }} <span class="text-danger">*</span>
            </label>
            <UserMultiSelector :id="teachersId" v-model="teachers" :options="allUsers" required />
        </div>

        <div>
            <label :for="durationId" class="form-label">
                {{ translate('Class duration') }}
            </label>
            <select
                :id="durationId"
                v-model="durationMinutes"
                class="form-select"
                :aria-label="translate('Class duration')"
            >
                <option :value="105">105 min</option>
                <option :value="165">165 min</option>
                <option value="custom">{{ translate('Custom') }}</option>
                <option :value="null">{{ translate('Variable') }}</option>
            </select>

            <div v-if="durationMinutes === 'custom'" class="input-group mt-2">
                <input
                    v-model="customDurationMinutes"
                    type="number"
                    class="form-control"
                    :aria-label="translate('Class duration')"
                    min="0"
                    required
                />
                <span class="input-group-text">min</span>
            </div>
        </div>

        <div>
            <label :for="classRepeatId" class="form-label">
                {{ translate('How many weeks are between classes?') }}
            </label>
            <input :id="classRepeatId" v-model="classRepeatWeeks" type="number" min="1" class="form-control" required />
        </div>

        <div class="text-center mt-2">
            <button type="submit" class="btn btn-success">
                {{ translate(isEditing ? 'Save' : 'Add') }}
            </button>
            <ButtonWithConfirmationPopover v-if="isEditing" class="btn btn-danger ms-4" @click="doDelete()">
                {{ translate('Delete subject') }}
            </ButtonWithConfirmationPopover>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Subject with this name already exists.') }}
        </div>
    </form>
</template>

<style scoped lang="scss">
textarea {
    min-height: 160px;
}
</style>
