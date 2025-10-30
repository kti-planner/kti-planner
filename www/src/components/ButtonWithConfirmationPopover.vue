<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { langId } from '@components/frontend/lang';
import Popover from '@components/Popover.vue';

const translations = {
    'en': {
        'Are you sure?': 'Are you sure?',
        'Yes': 'Yes',
        'No': 'No',
    },
    'pl': {
        'Are you sure?': 'Czy na pewno?',
        'Yes': 'Tak',
        'No': 'Nie',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const emit = defineEmits<{
    click: [];
}>();

const buttonElement = useTemplateRef('buttonElement');
const popover = useTemplateRef('popover');
</script>

<template>
    <button ref="buttonElement" type="button" :="$attrs">
        <slot></slot>
    </button>
    <Popover ref="popover" :element="buttonElement" :title="translate('Are you sure?')">
        <div class="confirmation-popover hstack column-gap-3">
            <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="
                    emit('click');
                    popover?.hide();
                "
            >
                {{ translate('Yes') }}
            </button>
            <button type="button" class="btn btn-secondary btn-sm" @click="popover?.hide()">
                {{ translate('No') }}
            </button>
        </div>
    </Popover>
</template>

<style scoped lang="scss">
.confirmation-popover button {
    width: 8ch;
}
</style>
