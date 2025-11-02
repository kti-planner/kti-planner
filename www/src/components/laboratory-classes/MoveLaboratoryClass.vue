<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch } from '@components/api';
import type { EventConflict } from '@components/calendar/types';
import type { LaboratoryClassData, LaboratoryClassMoveApiData } from '@components/laboratory-classes/types';
import { formatDateLocalYyyyMmDd } from '@components/utils';

const { laboratoryClass, apiUrl } = defineProps<{
    laboratoryClass: LaboratoryClassData;
    apiUrl: string;
}>();

const translations = {
    'en': {
        'This will recursively move this class and the class occupying the slot this class will be moved to.':
            'This will recursively move this class and the class occupying the slot this class will be moved to.',
        'Move by': 'Move by',
        'week': 'week',
        'weeks': 'weeks',
        'forwards': 'forwards',
        'backwards': 'backwards',
        'Move': 'Move',
        'Holiday': 'Holiday',
        'Another class takes place in this classroom': 'Another class takes place in this classroom',
        'Outside of semester': 'Outside of semester',
        'Move by weeks': 'Move by weeks',
        'Move by direction': 'Move by direction',
    },
    'pl': {
        'This will recursively move this class and the class occupying the slot this class will be moved to.':
            'Spowoduje to rekurencyjne przeniesienie tych zajęć i zajęć zajmujących miejsce, do którego zostaną przeniesione te zajęcia.',
        'Move by': 'Przesuń o',
        'week': 'tydzień',
        'weeks': 'tygodnie',
        'forwards': 'w przód',
        'backwards': 'wstecz',
        'Move': 'Przesuń',
        'Holiday': 'Dzień wolny',
        'Another class takes place in this classroom': 'W wybranej sali odbywają się inne zajęcia',
        'Outside of semester': 'Poza semestrem',
        'Move by weeks': 'Tygodnie do przesunięcia',
        'Move by direction': 'Kierunek przesuwania',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const emit = defineEmits<{
    submit: [];
}>();

const weeks = ref<number | string>(1);

type Direction = 'forwards' | 'backwards';
const direction = ref<Direction>('forwards');

const eventConflicts = ref<EventConflict[]>([]);

async function moveLaboratoryClasses() {
    if (typeof weeks.value === 'string') {
        return;
    }

    eventConflicts.value = [];

    const conflicts = await apiPatch<EventConflict[]>(apiUrl, {
        id: laboratoryClass.id,
        moveByWeeks: weeks.value * (direction.value === 'forwards' ? 1 : -1),
    } satisfies LaboratoryClassMoveApiData);

    if (conflicts === undefined) {
        return;
    }

    if (conflicts.length === 0) {
        emit('submit');
        return;
    }

    eventConflicts.value = conflicts;
}

const moveById = crypto.randomUUID();
const weekId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2" @submit.prevent="moveLaboratoryClasses">
        <p class="mb-0">
            {{
                translate(
                    'This will recursively move this class and the class occupying the slot this class will be moved to.',
                )
            }}
        </p>

        <div class="input-group">
            <span :id="moveById" class="input-group-text">{{ translate('Move by') }}:</span>
            <input
                v-model="weeks"
                type="number"
                :min="1"
                class="form-control"
                :aria-label="translate('Move by weeks')"
                :aria-describedby="`${moveById} ${weekId}`"
                :style="{ minWidth: '60px' }"
            />
            <span :id="weekId" class="input-group-text text-center d-inline-block" :style="{ minWidth: '94px' }">
                {{ weeks === 1 ? translate('week') : translate('weeks') }}
            </span>
            <select
                v-model="direction"
                class="form-select"
                required
                :aria-label="translate('Move by direction')"
                :style="{ minWidth: '135px' }"
            >
                <option value="forwards">{{ translate('forwards') }}</option>
                <option value="backwards">{{ translate('backwards') }}</option>
            </select>
        </div>

        <div class="text-center mt-2">
            <button type="submit" class="btn btn-success">
                {{ translate('Move') }}
            </button>
        </div>

        <ul v-if="eventConflicts.length > 0">
            <li v-for="conflict in eventConflicts" :key="conflict.startDate">
                {{ `${formatDateLocalYyyyMmDd(new Date(conflict.startDate))}: ` }}
                <span class="text-danger">
                    {{
                        conflict.type === 'holiday'
                            ? translate('Holiday')
                            : conflict.type === 'other-event'
                              ? translate('Another class takes place in this classroom')
                              : translate('Outside of semester')
                    }}
                </span>
            </li>
        </ul>
    </form>
</template>
