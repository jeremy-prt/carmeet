<template>
  <header
    class="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-4"
  >
    <NuxtLink to="/" class="cursor-pointer flex items-center z-50">
      <img src="/logo.png" alt="logo" class="h-7 cursor-pointer" />
    </NuxtLink>
    <nav class="flex gap-8">
      <NuxtLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="text-white font-medium relative group transition"
      >
        <span class="group-hover:text-main duration-300">{{ item.name }}</span>
        <span
          class="underline-anim absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-main group-hover:w-full transition-all duration-300"
        ></span>
      </NuxtLink>
    </nav>
    <div class="flex">
      <span class="w-10"></span>

      <NuxtLink
        to="/connexion"
        class="bg-main z-50 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow duration-300 cursor-pointer"
      >
        Se connecter
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
const navItems = [
  { name: "Accueil", to: "/" },
  { name: "Événements", to: "/evenements" },
  { name: "Boutique", to: "/boutique" },
  { name: "Contact", to: "/contact" },
];
</script>

<style scoped>
nav .group:hover .underline-anim {
  width: 100%;
}
</style>
