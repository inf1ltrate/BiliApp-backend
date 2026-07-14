<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>我的点赞</h2>
    </div>
    <div class="like-list">
      <div class="like-card" v-for="v in liked" :key="v.id" @click="$router.push('/video/' + v.id)">
        <div class="l-cover"><img :src="v.thumb || 'https://picsum.photos/400/225?random=' + v.id" /></div>
        <div class="l-info">
          <h4>{{ v.name }}</h4>
          <p>{{ v.author }}</p>
          <div class="l-stats"><span>▶ {{ format(v.views) }}</span><span>❤ {{ v.likes }}</span></div>
        </div>
      </div>
      <div class="empty" v-if="liked.length === 0">还没有点赞过视频</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Likes',
  data() { return { liked: [] } },
  mounted() { this.fetch(); },
  methods: {
    async fetch() {
      try { const r = await fetch('http://localhost:8080/videos?limit=20'); const d = await r.json(); this.liked = (d.list || d).slice(0, 5); } catch (e) {}
    },
    format(n) { return n >= 10000 ? (n/10000).toFixed(1)+'万' : n; }
  }
}
</script>
<style scoped>
.page { background: #f4f4f4; }
.page-header { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: white; }
.back-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: #333; }
.page-header h2 { font-size: 16px; }
.like-list { padding: 12px; }
.like-card { display: flex; background: white; border-radius: 8px; overflow: hidden; margin-bottom: 10px; cursor: pointer; }
.l-cover { width: 120px; height: 80px; overflow: hidden; flex-shrink: 0; }
.l-cover img { width: 100%; height: 100%; object-fit: cover; }
.l-info { flex: 1; padding: 8px 10px; display: flex; flex-direction: column; justify-content: center; }
.l-info h4 { font-size: 14px; margin-bottom: 3px; }
.l-info p { font-size: 12px; color: #999; margin-bottom: 4px; }
.l-stats { display: flex; gap: 12px; font-size: 11px; color: #999; }
.empty { text-align: center; padding: 60px; color: #999; }
</style>