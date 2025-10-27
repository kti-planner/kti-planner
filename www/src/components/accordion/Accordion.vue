<script lang="ts">
export const accordionIdKey = Symbol() as InjectionKey<string>;
</script>

<script setup lang="ts">
import { type InjectionKey, provide } from 'vue';

const id = crypto.randomUUID();
provide(accordionIdKey, id);
</script>

<template>
    <div :id class="accordion">
        <slot></slot>
    </div>
</template>
