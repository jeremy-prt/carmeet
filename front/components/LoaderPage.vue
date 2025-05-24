<template>
  <div>
    <!-- Arrière-plan fixe -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 bg-[#150405] pointer-events-none"
    ></div>

    <!-- Texte "CARMEET" -->
    <div
      v-if="isLoading"
      ref="textContainer"
      class="fixed inset-0 z-50 flex items-center justify-center text-7xl font-bold text-white"
    >
      <span
        v-for="(letter, index) in 'CARMEET'"
        :key="index"
        :data-text="letter"
        class="relative inline-block text-white/20 font-unison"
        :style="{ '--clipPath': 'inset(100% 0 0 0)' }"
      >
        {{ letter }}
      </span>
    </div>

    <!-- Contenu révélé -->
    <div ref="pageContent" class="opacity-0 transition-opacity duration-1000">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import gsap from "gsap";

const isLoading = ref(true);
const emit = defineEmits(["loadingComplete"]);

const pageContent = ref(null);
const textContainer = ref(null);

onMounted(() => {
  if (typeof window === "undefined") return;

  gsap.set(pageContent.value, { opacity: 0 });

  const letters = textContainer.value.querySelectorAll("span");

  const tl = gsap.timeline({
    onComplete: finishAnimation,
  });

  // Animation du texte CARMEET
  tl.to(letters, {
    "--clipPath": "inset(0% 0 0 0)",
    duration: 1.5,
    stagger: 0.2,
    ease: "power2.out",
  });
});

function finishAnimation() {
  const letters = textContainer.value.querySelectorAll("span");
  const background = document.querySelector(".fixed.bg-\\[\\#150405\\]");

  const tl = gsap.timeline({
    onComplete: () => {
      isLoading.value = false;
      emit("loadingComplete");
    },
  });

  // Attendre un peu avant de faire disparaître le texte
  tl.to({}, { duration: 1 });

  // Disparition de "CARMEET"
  tl.to(letters, {
    opacity: 0,
    duration: 0.8,
    ease: "power1.out",
  });

  // Disparition du fond
  tl.to(
    background,
    {
      opacity: 0,
      duration: 1,
      ease: "power1.out",
    },
    "-=0.5"
  );

  // Révélation du contenu
  tl.to(
    pageContent.value,
    {
      opacity: 1,
      duration: 0.3,
    },
    "-=0.9"
  );
}
</script>

<style scoped>
span {
  position: relative;
}
span::before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #e3e3e3;
  clip-path: var(--clipPath);
  -webkit-clip-path: var(--clipPath);
}
</style>
