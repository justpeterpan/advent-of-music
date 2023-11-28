<script setup lang="ts">
onMounted(() => {
  const snowflakes = document.querySelectorAll('.snowflake')
  snowflakes.forEach((snowflake: any) => {
    // Randomize left position, animation delay, and duration
    const leftPos = Math.random() * 100
    const animDelay = Math.random() * 10
    const animDuration = 5 + Math.random() * 5

    snowflake.style.left = `${leftPos}%`
    snowflake.style.animationDelay = `${animDelay}s, ${animDelay}s`
    snowflake.style.animationDuration = `${animDuration}s, 3s`
  })
})

useHead({
  bodyAttrs: {
    class: 'bg-neutral-950',
  },
})
</script>

<template>
  <div class="snowflakes text-white" aria-hidden="true">
    <div v-for="n in 100" class="snowflake" :key="n">❅</div>
  </div>
  <div
    class="flex place-items-center h-screen flex-col justify-center bg-black text-white"
  >
    <p class="font-bold">
      Oops! Something went wrong with the calendar link provided.
    </p>
    <p class="mb-10">
      Please check if you've inserted the correct link and try again.
    </p>

    <NuxtLink :to="useRuntimeConfig().public.admin" target="_self"
      ><button class="button" type="button">
        <span class="button__text">Create your own calendar</span>
        <span class="button__icon"
          ><svg
            class="svg"
            fill="none"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" x2="12" y1="5" y2="19"></line>
            <line x1="5" x2="19" y1="12" y2="12"></line></svg
        ></span></button
    ></NuxtLink>
  </div>
</template>

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
.button {
  --main-focus: #fff;
  --font-color: #000;
  --bg-color-sub: #000;
  --bg-color: #fff;
  --main-color: #fff;
  position: relative;
  width: 280px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  border-radius: 10px;
  overflow: hidden;
}

.button,
.button__icon,
.button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(22px);
  color: var(--font-color);
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(159px);
  height: 100%;
  width: 60px;
  left: 70px;
  background-color: var(--bg-color-sub);
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 40px;
  margin-right: 10px;
  fill: var(--main-color);
}

.button:hover {
  background: var(--bg-color);
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 350px;
  left: 0;
  transform: translateX(0);
}

.button:hover .svg {
  margin-right: 75px;
}
</style>
