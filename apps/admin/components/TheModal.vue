<script setup>
const props = defineProps({
  show: Boolean,
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container rainbow-box">
        <div class="modal-header"><h3>How it works</h3></div>

        <div class="modal-body">
          <ol>
            <li>
              <strong class="text-red-300">1. </strong>Create public spotify
              playlist
            </li>
            <li>
              <strong class="text-blue-300">2. </strong>Copy playlist link
            </li>
            <li>
              <strong class="text-green-300">3. </strong>Paste link into
              playlist field
            </li>
            <li>
              <strong class="text-yellow-300">4. </strong>Give calendar a title
            </li>
            <li><strong class="text-orange-300">5. </strong>Create calendar</li>
            <li>
              <strong class="text-purple-300">6. </strong> Share with lovely
              people
            </li>
          </ol>
        </div>

        <div class="modal-footer">
          <h3>More Information</h3>
          <ul class="mt-5">
            <li>
              <strong class="text-red-300">•</strong> Your personal data is not
              tracked or stored
            </li>
            <li>
              <strong class="text-blue-300">•</strong> Song order determines the
              calendar's order
            </li>
            <li>
              <strong class="text-green-300">•</strong> New door will become
              accessible daily at 00:00 UTC
            </li>
            <li>
              <strong class="text-yellow-300">•</strong> Playlists with less
              than 24 songs will only show available songs
            </li>
            <li>
              <strong class="text-orange-300">•</strong> Playlists with more
              than 24 songs will only show the first 24 songs
            </li>
          </ul>
        </div>
        <button class="modal-default-button" @click="$emit('close')">OK</button>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: black;
  color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

h3 {
  margin-top: 0;
  color: #feffe9;
  font-size: larger;
  font-weight: 500;
  text-decoration: dotted underline;
  text-underline-offset: 4px;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  margin-top: 10px;
  border: 2px solid;
  border-image: linear-gradient(
    to bottom right,
    #b827fc 0%,
    #2c90fc 25%,
    #b8fd33 50%,
    #fec837 75%,
    #fd1892 100%
  );
  border-image-slice: 1;
  padding: 10px 20px;
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

li {
  min-width: min-content;
  margin-bottom: 4px;
  display: flex;
  gap: 4px;
  font-size: smaller;
  font-weight: 400;
}

.rainbow-box {
  border: 5px solid transparent;
  border-image: linear-gradient(
    to bottom right,
    #b827fc 0%,
    #2c90fc 25%,
    #b8fd33 50%,
    #fec837 75%,
    #fd1892 100%
  );
  border-image-slice: 1;
}
</style>
