<template>
  <div class="viewer">
    <div id="zoompan">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Panzoom from '@panzoom/panzoom';

export default {
  updated() {
    const elem = document.getElementById('zoompan');
    const panzoom = Panzoom(elem, { maxScale: 5 });
    panzoom.pan(1, 1);
    panzoom.zoom(1, { animate: true });
    elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel, { passive: false });
  },
};
</script>

<style>
.viewer {
  height: 100%,
}
</style>
