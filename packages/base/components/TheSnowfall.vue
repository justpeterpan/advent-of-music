<template>
  <div class="snowflakes text-white" aria-hidden="true">
    <div v-for="n in 100" :key="n" class="snowflake">❅</div>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  const snowflakes = document.querySelectorAll(".snowflake");
  snowflakes.forEach((snowflake: any) => {
    // Randomize left position, animation delay, and duration
    const leftPos = Math.random() * 100;
    const animDelay = Math.random() * 10;
    const animDuration = 5 + Math.random() * 5;

    snowflake.style.left = `${leftPos}%`;
    snowflake.style.animationDelay = `${animDelay}s, ${animDelay}s`;
    snowflake.style.animationDuration = `${animDuration}s, 3s`;
  });
});
</script>

<style>
@-webkit-keyframes snowflakes-fall {
  0% {
    top: -10%;
  }
  100% {
    top: 100%;
  }
}
@-webkit-keyframes snowflakes-shake {
  0% {
    -webkit-transform: translateX(0px);
    transform: translateX(0px);
  }
  50% {
    -webkit-transform: translateX(80px);
    transform: translateX(80px);
  }
  100% {
    -webkit-transform: translateX(0px);
    transform: translateX(0px);
  }
}
@keyframes snowflakes-fall {
  0% {
    top: -10%;
  }
  100% {
    top: 100%;
  }
}
@keyframes snowflakes-shake {
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(80px);
  }
  100% {
    transform: translateX(0px);
  }
}
.snowflake {
  position: fixed;
  top: -10%;
  z-index: 999;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
  -webkit-animation-name: snowflakes-fall, snowflakes-shake;
  -webkit-animation-duration: 10s, 3s;
  -webkit-animation-timing-function: linear, ease-in-out;
  -webkit-animation-iteration-count: infinite, infinite;
  -webkit-animation-play-state: running, running;
  animation-name: snowflakes-fall, snowflakes-shake;
  animation-duration: 10s, 3s;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite, infinite;
  animation-play-state: running, running;
}
</style>
