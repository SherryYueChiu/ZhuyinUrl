<script setup lang="ts">
import TitleBar from "./components/TitleBar.vue";
import CreatorSection from "./components/CreatorSection.vue";
import VisitorSection from "./components/VisitorSection.vue";
</script>

<template>
  <div>
    <TitleBar />
    <div class="container">
      <VisitorSection />
      <CreatorSection />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  & > .input-section {
    width: 100vw;
  }
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
    & > .input-section {
      width: 50vw;
    }
  }
}
</style>
