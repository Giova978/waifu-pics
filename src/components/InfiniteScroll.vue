<template>
    <div ref="bottom"></div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import { debounce } from "../Utils";

const props = defineProps({
    infinite: {
        type: Function,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
    firstRender: {
        type: Boolean,
        required: true,
    },
});

const bottom = ref<Element | null>(null);

const observer = new IntersectionObserver(
    debounce(() => {
        if (props.loading || props.firstRender) return;

        props.infinite();
    }, 500),
    {
        threshold: 0.1,
    },
);

onMounted(() => {
    observer.observe(bottom.value!);
});
</script>
