<script setup lang="ts">
const { id = crypto.randomUUID(), initiallyExpanded: initiallyExpandedProp = false } = defineProps<{
    id?: string;
    initiallyExpanded?: boolean | undefined;
}>();

// Make a non-reactive copy of the initiallyExpanded prop
const initiallyExpanded = initiallyExpandedProp;
</script>

<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button
                class="accordion-button"
                :class="{ collapsed: !initiallyExpanded }"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#${id}`"
                :aria-expanded="initiallyExpanded"
                :aria-controls="id"
            >
                <slot name="header"></slot>
            </button>
        </h2>
        <div :id class="accordion-collapse collapse" :class="{ show: initiallyExpanded }">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
