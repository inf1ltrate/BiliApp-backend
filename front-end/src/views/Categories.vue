<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>视频分类</h2>
    </div>
    <div class="cat-grid">
      <div class="cat-item" v-for="cat in categories" :key="cat.id" @click="selectCat(cat.id)">
        <img :src="cat.icon" class="cat-icon" />
        <span>{{ cat.name }}</span>
      </div>
    </div>
    <div v-if="selected" class="video-section">
      <h3>分类视频</h3>
      <div class="video-card" v-for="v in catVideos" :key="v.id" @click="$router.push('/video/' + v.id)">
        <div class="v-cover"><img :src="v.thumb || 'https://picsum.photos/400/225?random=' + v.id" /><span class="pc">{{ format(v.views) }}</span></div>
        <div class="v-meta"><h4>{{ v.name }}</h4><p>{{ v.author }}</p></div>
      </div>
    </div>
    <div v-else class="empty-tip">选择分类查看视频</div>
  </div>
</template>
<script>
export default {
  name: 'Categories',
  data() { return { categories: [], selected: null, catVideos: [] } },
  mounted() { this.fetchCats(); },
  methods: {
    async fetchCats() {
      try { const r = await fetch('http://localhost:8080/categories'); this.categories = await r.json(); } catch (e) {}
    },
    async selectCat(id) {
      this.selected = id;
      try { const r = await fetch('http://localhost:8080/videos?category_id=' + id); const d = await r.json(); this.catVideos = d.list || d; } catch (e) {}
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
.cat-grid { display: flex; flex-wrap: wrap; padding: 12px; }
.cat-item { width: 33.33%; display: flex; flex-direction: column; align-items: center; padding: 10px; cursor: pointer; }
.cat-icon { width: 44px; height: 44px; border-radius: 50%; margin-bottom: 6px; }
.cat-item span { font-size: 12px; }
.video-section { margin: 12px; }
.video-section h3 { font-size: 14px; padding: 8px 4px; }
.video-card { background: white; border-radius: 8px; overflow: hidden; margin-bottom: 10px; cursor: pointer; }
.v-cover { position: relative; height: 160px; }
.v-cover img { width: 100%; height: 100%; object-fit: cover; }
.pc { position: absolute; bottom: 6px; left: 8px; background: rgba(0,0,0,0.6); color: white; font-size: 11px; padding: 2px 6px; border-radius: 4px; }
.v-meta { padding: 8px 10px; }
.v-meta h4 { font-size: 13px; margin-bottom: 3px; }
.v-meta p { font-size: 12px; color: #999; }
.empty-tip { text-align: center; padding: 40px; color: #999; }
</style>