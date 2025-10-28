<script setup lang="ts">
import { computed, ref } from 'vue';

const { id = crypto.randomUUID(), contentRendering = 'after-first-open' } = defineProps<{
    id?: string;
    contentRendering?: 'always' | 'after-first-open' | undefined;
}>();

const contentVisible = ref<boolean>(false);
const renderContent = computed(() => contentVisible.value || contentRendering === 'always');

function onShow() {
    contentVisible.value = true;
}
</script>

<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#${id}`"
                aria-expanded="false"
                :aria-controls="id"
            >
                <slot name="header"></slot>
            </button>
        </h2>
        <div
            :id
            class="accordion-collapse collapse"
            v-on="{
                'show.bs.collapse': onShow,
            }"
        >
            <div class="accordion-body">
                <slot v-if="renderContent"></slot>
            </div>
        </div>
    </div>
</template>
