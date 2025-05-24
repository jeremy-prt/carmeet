<template>
  <section class="w-full py-8">
    <div class="flex items-center justify-between mb-3 px-3">
      <h2 class="text-2xl md:text-3xl font-bold text-white">
        <span class="text-main">Événements</span> en vedette
      </h2>
      <div class="flex gap-2">
        <button
          @click="goPrev"
          class="text-gray-400 hover:text-main transition cursor-pointer"
          aria-label="Précédent"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          @click="goNext"
          class="text-gray-400 hover:text-main transition cursor-pointer"
          aria-label="Suivant"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
    <Carousel ref="carouselRef" v-bind="carouselConfig">
      <Slide v-for="event in events" :key="event.id_event" class="py-1 px-3">
        <EventCard :event="event" />
      </Slide>
    </Carousel>
    <div v-if="loading" class="flex justify-center mt-8">
      <LoaderSpinner />
    </div>
    <div
      v-else-if="hasFetched && events.length === 0"
      class="text-center text-gray-400 py-12 w-full"
    >
      Aucun événement disponible pour le moment.
    </div>
  </section>
</template>

<script setup lang="ts">
import "vue3-carousel/carousel.css";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { Carousel, Slide } from "vue3-carousel";

const carouselRef = ref();
let interval: ReturnType<typeof setInterval> | null = null;

const itemsToShow = ref(3);

function updateItemsToShow() {
  const width = window.innerWidth;
  if (width < 640) itemsToShow.value = 1;
  else if (width < 1024) itemsToShow.value = 2;
  else itemsToShow.value = 3;
}

const startAutoScroll = () => {
  stopAutoScroll();
  interval = setInterval(() => {
    goNext();
  }, 10000);
};

const stopAutoScroll = () => {
  if (interval) clearInterval(interval);
  interval = null;
};

const goPrev = () => {
  carouselRef.value?.prev();
  startAutoScroll();
};
const goNext = () => {
  carouselRef.value?.next();
  startAutoScroll();
};

const { events, loading, error, fetchFeaturedEvents } = useFeaturedEvents();

const hasFetched = ref(false);

onMounted(async () => {
  updateItemsToShow();
  window.addEventListener("resize", updateItemsToShow);
  startAutoScroll();
  await fetchFeaturedEvents();
  hasFetched.value = true;
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateItemsToShow);
  stopAutoScroll();
});

const carouselConfig = computed(() => ({
  itemsToShow: itemsToShow.value,
  wrapAround: true,
  slidesToScroll: 1,
  snapAlign: "start" as const,
}));
</script>
