<script setup lang="ts">
import { computed } from 'vue';
import { contrastRatio } from 'src/utils';
import { langId } from '@components/frontend/lang';

const translations = {
    'en': {
        'Contrast': 'Contrast',
        'Restore color': 'Restore color',
    },
    'pl': {
        'Contrast': 'Kontrast',
        'Restore color': 'Przywróć kolor',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const model = defineModel<string>({ required: true });

const contrast = computed(() => contrastRatio(model.value, '#FFFFFF'));

const { id = crypto.randomUUID() } = defineProps<{
    id?: string;
}>();

defineEmits<{
    restoreColor: [];
}>();
</script>

<template>
    <span>
        {{ `${translate('Contrast')}: ` }}
        <span :class="contrast >= 4.47 ? 'text-success' : 'text-danger'">
            {{ contrast.toPrecision(3) }}
        </span>
    </span>
    <button type="button" class="btn btn-success btn-sm ms-2" @click="$emit('restoreColor')">
        {{ translate('Restore color') }}
    </button>
    <input :id="id" v-model="model" type="color" class="form-control" required />
</template>
