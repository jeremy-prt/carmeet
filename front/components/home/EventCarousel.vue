<template>
  <div class="relative flex flex-col items-center">
    <Swiper
      :modules="modules"
      :breakpoints="{
        640: { slidesPerView: 1 }, // En sm (640px et plus), 1 slide visible
        768: { slidesPerView: 2 }, // En md (768px et plus), 2 slides visibles
        1024: { slidesPerView: 3 }, // En lg (1024px et plus), 3 slides visibles
      }"
      :autoplay="{ delay: 6000, disableOnInteraction: false }"
      @swiper="onSwiperInit"
      @autoplayTimeLeft="onAutoplayTimeLeft"
      @slideChange="onSlideChange"
      class="w-full"
    >
      <SwiperSlide v-for="event in props.events" :key="event.id_event">
        <EventCard
          :event="event"
          @mouseenter="pauseAutoplay"
          @mouseleave="resumeAutoplay"
        />
      </SwiperSlide>
    </Swiper>

    <!-- Barre de progression -->
    <div class="autoplay-small-bar mt-[-8px]">
      <div class="progress-fill" ref="progressBar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

import EventCard from "@/components/home/EventCard.vue";
import type { Event } from "@/types/event";

// Props
const props = defineProps<{
  events: Event[];
}>();

// Swiper modules
const modules = [Autoplay];
let swiperInstance: any = null;
const progressBar = ref<HTMLElement | null>(null);

// Autoplay handlers
const onSwiperInit = (swiper: any) => {
  swiperInstance = swiper;
};

const pauseAutoplay = () => {
  swiperInstance?.autoplay?.pause();
};

const resumeAutoplay = () => {
  swiperInstance?.autoplay?.resume();
};

const onAutoplayTimeLeft = (_: any, time: number, progress: number) => {
  if (progressBar.value) {
    progressBar.value.style.transform = `scaleX(${1 - progress})`;
  }
};

// Gestion des slides visibles
const visibleStartIndex = ref(0);
const slidesPerView = 3;

const onSlideChange = () => {
  if (swiperInstance) {
    visibleStartIndex.value = swiperInstance.realIndex;
  }
};
</script>

<style scoped>
.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0px;
}

.autoplay-small-bar {
  width: 80px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #bf272d;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.1s linear;
}
</style>
