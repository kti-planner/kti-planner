<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { accordionIdKey } from '@components/accordion/Accordion.vue';

const { id = crypto.randomUUID(), contentRendering = 'after-first-open' } = defineProps<{
    id?: string;
    contentRendering?: 'always' | 'after-first-open' | undefined;
}>();

const accordionId = inject(accordionIdKey, crypto.randomUUID());

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
                :data-bs-target="`#${accordionId}-${id}`"
                aria-expanded="false"
                :aria-controls="`${accordionId}-${id}`"
            >
                <slot name="header"></slot>
            </button>
        </h2>
        <div
            :id="`${accordionId}-${id}`"
            class="accordion-collapse collapse"
            :data-bs-parent="`#${accordionId}`"
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
