<script setup lang="ts">
const { id = crypto.randomUUID(), isExpanded = false } = defineProps<{
    id?: string;
    isExpanded?: boolean | undefined;
}>();
</script>

<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button
                class="accordion-button"
                :class="{ collapsed: !isExpanded }"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#${id}`"
                :aria-expanded="isExpanded"
                :aria-controls="id"
            >
                <slot name="header"></slot>
            </button>
        </h2>
        <div :id class="accordion-collapse collapse" :class="{ show: isExpanded }">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
