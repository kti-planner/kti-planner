<script setup lang="ts">
import { computed } from 'vue';
import { contrastRatio, randomHexColor } from 'src/utils';
import { langId } from '@components/frontend/lang';

const translations = {
    'en': {
        'Contrast': 'Contrast',
        'Random color': 'Random color',
    },
    'pl': {
        'Contrast': 'Kontrast',
        'Random color': 'Losowy kolor',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const model = defineModel<string>({ required: true });

const { id = crypto.randomUUID() } = defineProps<{
    id?: string;
}>();

const contrast = computed(() => contrastRatio(model.value, '#FFFFFF'));

function randomizeColor() {
    model.value = randomHexColor();
}
</script>

<template>
    <div class="hstack gap-3">
        <input :id="id" v-model="model" type="color" class="form-control form-control-color" required />
        <div>
            {{ `${translate('Contrast')}: ` }}
            <span :class="contrast >= 4.47 ? 'text-success' : 'text-danger'">
                {{ contrast.toPrecision(3) }}
            </span>
            <button type="button" class="btn btn-success btn-sm ms-2" @click="randomizeColor()">
                {{ translate('Random color') }}
            </button>
        </div>
    </div>
</template>
