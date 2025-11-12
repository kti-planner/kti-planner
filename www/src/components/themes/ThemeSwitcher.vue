<script setup lang="ts">
import { onMounted } from 'vue';
import { type RemovableRef, useStorage } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import IconButton from '@components/IconButton.vue';

const translations = {
    'en': {
        'Change theme': 'Change theme',
        'Themes': 'Themes',
        'Modern': 'Modern',
        'Classic (green)': 'Classic (green)',
    },
    'pl': {
        'Change theme': 'Zmień motyw',
        'Themes': 'Motywy',
        'Modern': 'Nowoczesny',
        'Classic (green)': 'Klasyczny (zielony)',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

type Theme = 'modern' | 'classic';
const theme = useStorage('theme', 'modern') as RemovableRef<Theme>;

onMounted(() => {
    if (theme.value !== 'modern' && theme.value !== 'classic') {
        theme.value = 'modern';
    }
});

function changeTheme(newTheme: Theme) {
    theme.value = newTheme;
    window.location.reload();
}
</script>

<template>
    <div class="dropdown-">
        <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="btn dropdown-item" type="button">foo</button></li>
            <li><button class="btn dropdown-item" type="button">bar</button></li>
        </ul>
    </div>

    <div class="btn-group">
        <IconButton
            icon="palette-fill"
            :title="translate('Change theme')"
            :aria-label="translate('Change theme')"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        />
        <ul class="dropdown-menu dropdown-menu-end">
            <li>
                <h6 class="dropdown-header">{{ translate('Themes') }}</h6>
            </li>
            <li>
                <button
                    class="dropdown-item"
                    type="button"
                    :style="{ paddingLeft: theme !== 'modern' ? '37px' : undefined }"
                    @click="changeTheme('modern')"
                >
                    <i v-if="theme === 'modern'" class="bi bi-check text-success"></i>
                    {{ translate('Modern') }}
                </button>
            </li>
            <li>
                <button
                    class="dropdown-item"
                    type="button"
                    :style="{ paddingLeft: theme !== 'classic' ? '37px' : undefined }"
                    @click="changeTheme('classic')"
                >
                    <i v-if="theme === 'classic'" class="bi bi-check text-success"></i>
                    {{ translate('Classic (green)') }}
                </button>
            </li>
        </ul>
    </div>
</template>
