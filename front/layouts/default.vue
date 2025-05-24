<template>
  <div class="min-h-screen bg-black relative overflow-hidden">
    <!-- Premier SVG en haut à gauche -->
    <svg
      class="absolute -top-1/4 scale-300 -left-1/4 w-[800px] h-[800px] opacity-50 animate-float-slow"
      viewBox="0 0 1822 2015"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="1" filter="url(#filter0_f_107_2)">
        <path
          d="M772.327 450L450 678.374L1048.97 1564.91L1371.29 1336.54L772.327 450Z"
          fill="url(#paint0_linear_107_2)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_107_2"
          x="0"
          y="0"
          width="1821.29"
          height="2014.91"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="225"
            result="effect1_foregroundBlur_107_2"
          />
        </filter>
        <linearGradient
          id="paint0_linear_107_2"
          x1="538.155"
          y1="874.43"
          x2="1388.08"
          y2="1022.03"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#AB6667" />
          <stop offset="0.859375" stop-color="#C3080B" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Deuxième SVG en bas à droite -->
    <svg
      class="absolute -bottom-1/4 scale-200 -right-1/4 w-[800px] h-[800px] opacity-50 animate-float-slow-reverse"
      viewBox="0 0 1822 2015"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="1" filter="url(#filter0_f_107_2_2)">
        <path
          d="M772.327 450L450 678.374L1048.97 1564.91L1371.29 1336.54L772.327 450Z"
          fill="url(#paint0_linear_107_2_2)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_107_2_2"
          x="0"
          y="0"
          width="1821.29"
          height="2014.91"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="225"
            result="effect1_foregroundBlur_107_2"
          />
        </filter>
        <linearGradient
          id="paint0_linear_107_2_2"
          x1="538.155"
          y1="874.43"
          x2="1388.08"
          y2="1022.03"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#AB6667" />
          <stop offset="0.859375" stop-color="#C3080B" />
        </linearGradient>
      </defs>
    </svg>

    <Header />
    <main class="relative pt-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <slot />
    </main>
  </div>
</template>

<script setup></script>

<style>
@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(2%, 2%) rotate(1deg);
  }
  50% {
    transform: translate(0, 4%) rotate(0deg);
  }
  75% {
    transform: translate(-2%, 2%) rotate(-1deg);
  }
}

@keyframes float-slow-reverse {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-2%, -2%) rotate(-1deg);
  }
  50% {
    transform: translate(0, -4%) rotate(0deg);
  }
  75% {
    transform: translate(2%, -2%) rotate(1deg);
  }
}

.animate-float-slow {
  animation: float-slow 20s ease-in-out infinite;
}

.animate-float-slow-reverse {
  animation: float-slow-reverse 20s ease-in-out infinite;
}
</style>
