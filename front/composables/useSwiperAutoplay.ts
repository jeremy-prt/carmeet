import type { Swiper as SwiperClass } from "swiper/types";
import { ref } from "vue";

export function useSwiperAutoplay() {
  const swiperInstance = ref<SwiperClass | null>(null);
  const progressBar = ref<HTMLElement | null>(null);

  const onSwiperInit = (swiper: SwiperClass) => {
    swiperInstance.value = swiper;
  };

  const pauseAutoplay = () => {
    swiperInstance.value?.autoplay?.pause();
  };

  const resumeAutoplay = () => {
    swiperInstance.value?.autoplay?.resume();
  };

  const onAutoplayTimeLeft = (_: any, time: number, progress: number) => {
    if (progressBar.value) {
      progressBar.value.style.transform = `scaleX(${1 - progress})`;
    }
  };

  return {
    swiperInstance,
    progressBar,
    onSwiperInit,
    pauseAutoplay,
    resumeAutoplay,
    onAutoplayTimeLeft,
  };
}
