<template>
  <div id="bg" ref="bg">
    <v-icon
      v-show="replayWorstOngoing"
      x-large
      class="drill"
    >mdi-shimmer</v-icon>
  </div>
</template>

<script lang="ts">
import { randomItems, without } from '@/utils/functions';
import { gsap } from 'gsap';
import Vue from 'vue';

const boxes: Element[] = [];

export default Vue.extend({
  data() {
    return {
      height: 0
    };
  },
  computed: {
    replayWorstOngoing(): boolean {
      return this.$store.state.playWorstMode;
    }
  },
  watch: {
    height(newVal, oldVal) {
      const bg = this.$refs.bg! as Element;
      let count = 0;
      const initHeight = this.height && (this.height + 48);
      if (newVal > oldVal) {
        while(count < 1024 && this.$el.scrollHeight <= initHeight) {
          bg.appendChild(document.createElement('div'))
          count ++;
        }
        bg.removeChild(bg.lastElementChild!);
        boxes.length = 0;
        boxes.push(... bg.children);
      } else {
        while(count < 1024 && this.$el.scrollHeight > initHeight) {
          bg.removeChild(boxes.pop()!);
          count ++;
        }
      }
      if (count === 0) {
        return;
      }
      const greys = randomItems(boxes, boxes.length * 0.3);
      const eee = randomItems(without(boxes, greys), boxes.length * 0.28);
      const f3f3f3 = randomItems(without(boxes, [...eee, ...greys]), boxes.length * 0.25);
      const greens = randomItems(boxes, boxes.length * 0.08);
      gsap.defaults({
        duration: 1,
        ease: 'sine',
      });
      gsap.fromTo(without(greys, greens), {
        backgroundColor: 'white'
      }, {
        backgroundColor: '#f7f7f7',
      })
      gsap.fromTo(without(f3f3f3, greens), {
        backgroundColor: 'white'
      }, {
        backgroundColor: '#f3f3f3',
      })
      gsap.fromTo(without(eee, greens), {
        backgroundColor: 'white'
      }, {
        backgroundColor: '#eee',
      })
      gsap.fromTo(greens, {
        backgroundColor: 'white'
      }, {
        backgroundColor: '#ceecce',
      })
      gsap.to('.drill', {
        color: 'orange',
        backgroundColor: 'transparent',
        repeat: -1,
        yoyo: true,
        duration: 2,
        scale: 2,
        startAt: { color: '#fff', backgroundColor: 'transparent', scale: 1 },
      })
    }
  },
  mounted() {
    setInterval(() => {
      this.height = this.$parent.$el.scrollHeight;
    }, 500);
  },
})
</script>

<style>
#bg {
  height: 100%;
  width: 105%;
  right: -1rem;
  overflow: hidden;
  position: absolute;
}

#bg div {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  margin: 0.5rem;
  border-radius: 0.25rem;
  background-color: transparent;
}

.drill.v-icon {
  position: absolute;
  right: 2rem;
  top: 2rem;
  background-color: transparent;
}
</style>