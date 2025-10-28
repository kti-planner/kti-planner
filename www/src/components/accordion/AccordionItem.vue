<script setup lang="ts">
const { id = crypto.randomUUID() } = defineProps<{
    id?: string;
}>();
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
        <div :id class="accordion-collapse collapse">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
