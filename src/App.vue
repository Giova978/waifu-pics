<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { nextTick, onBeforeMount, watch } from "@vue/runtime-core";
import { axios, debounce } from "./Utils";
import InfiniteScroll from "./components/InfiniteScroll.vue";

const sfw = ref("true");
const sfwCategory = ref("waifu");
const nsfwCategory = ref("waifu");
const images = ref<string[]>([]);
const loading = ref(false);
const firstRender = ref(true);

const setLoading = (value: boolean) => {
    loading.value = value;
};

const getPics = async (sfw: string, category: string, extent = false) => {
    const type = sfw === "true" ? "sfw" : "nsfw";
    const exclude = images.value;

    if (!extent) {
        images.value = [];
        setLoading(true);
    }

    try {
        const { data } = await axios.post(`many/${type}/${category}`, {
            body: {
                exclude,
            },
        });

        // @ts-ignore
        images.value = [...images.value, ...data.files];
    } catch (error) {
        console.error("Error at fetching the images", type, error);
    } finally {
        nextTick(() => setLoading(false));
    }
};

const infinite = () => getPics(sfw.value, sfw.value === "true" ? sfwCategory.value : nsfwCategory.value, true);
const backToTop = () =>
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

watch(sfw, (value) => {
    getPics(value, sfwCategory.value);
});

watch(sfwCategory, (value) => {
    getPics(sfw.value, value);
});

watch(nsfwCategory, (value) => {
    getPics(sfw.value, value);
});

onBeforeMount(() => {
    getPics(sfw.value, sfwCategory.value);
    debounce(() => (firstRender.value = false), 2000)();
});
</script>

<template>
    <form class="w-full grid justify-center grid-flow-col">
        <select class="select" name="type" v-model.boolean="sfw">
            <option value="true">SFW</option>
            <option value="false">NSFW</option>
        </select>

        <select class="select" name="sfw-categories" v-model="sfwCategory" v-if="sfw === 'true'">
            <option value="waifu">Waifu</option>
            <option value="neko">Neko</option>
            <option value="shinobu">Shinobu</option>
            <option value="megumin">Megumin</option>
            <option value="bully">Bully</option>
            <option value="cuddle">Cuddle</option>
            <option value="cry">Cry</option>
            <option value="hug">Hug</option>
            <option value="awoo">Awoo</option>
            <option value="kiss">Kiss</option>
            <option value="lick">Lick</option>
            <option value="pat">Pat</option>
            <option value="smug">Smug</option>
            <option value="bonk">Bonk</option>
            <option value="yeet">Yeet</option>
            <option value="blush">Blush</option>
            <option value="smile">Smile</option>
            <option value="wave">Wave</option>
            <option value="highfive">Highfive</option>
            <option value="handhold">Handhold</option>
            <option value="nom">Nom</option>
            <option value="bite">Bite</option>
            <option value="glomp">Glomp</option>
            <option value="slap">Slap</option>
            <option value="kill">Kill</option>
            <option value="kick">Kick</option>
            <option value="happy">Happy</option>
            <option value="wink">Wink</option>
            <option value="poke">Poke</option>
            <option value="dance">Dance</option>
            <option value="cringe">Cringe</option>
        </select>

        <select class="select" name="nsfw-categories" v-model="nsfwCategory" v-else>
            <option value="waifu">Waifu</option>
            <option value="neko">Neko</option>
            <option value="trap">Trap</option>
            <option value="blowjob">Blowjob</option>
        </select>
    </form>

    <!-- <section class="sticky h-screen w-full pointer-events-none"> -->
    <button class="back-top" @click="backToTop">Top</button>
    <!-- </section> -->

    <main class="grid justify-center">
        <div class="loader" v-show="loading">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="500"
                height="500"
                viewBox="0 0 100 100"
                overflow="visible"
                fill="#93b7c1"
            >
                <defs><circle id="inline" cx="20" cy="50" r="6"></circle></defs>
                <use xlink:href="#inline" x="0">
                    <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="1s"
                        begin="0s"
                        repeatCount="indefinite"
                    ></animate>
                </use>
                <use xlink:href="#inline" x="20">
                    <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="1s"
                        begin="0.25s"
                        repeatCount="indefinite"
                    ></animate>
                </use>
                <use xlink:href="#inline" x="40">
                    <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="1s"
                        begin="0.5s"
                        repeatCount="indefinite"
                    ></animate>
                </use>
                <use xlink:href="#inline" x="60">
                    <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="1s"
                        begin="0.75s"
                        repeatCount="indefinite"
                    ></animate>
                </use>
            </svg>
        </div>

        <section class="gallery flex flex-wrap justify-center mt-5 max-w-5xl">
            <img v-for="image in images" :src="image" loading="lazy" />
            <InfiniteScroll :infinite="infinite" :loading="loading" :firstRender="firstRender"></InfiniteScroll>
        </section>
    </main>
</template>

<style>
.back-top {
    position: fixed;
    width: 50px;
    height: 50px;
    bottom: 2rem;
    right: 2rem;
    border-radius: 5px;
    @apply bg-green-500 text-white;
}

.gallery img::not(:first-child) {
    margin-top: 2rem;
}

.gallery img {
    min-height: 100px;
    min-width: 100px;
}

.loader {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
}

.select {
    margin-top: 1rem;
    margin-left: 1rem;
    @apply w-auto h-7 text-center border-2 border-green-500 rounded-md;
}

@media screen and (max-width: 700px) {
    .back-top {
        bottom: 1rem;
        right: 1rem;
    }
}
</style>
