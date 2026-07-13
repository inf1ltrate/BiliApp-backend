<template>
  <div class="categories">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>视频分类</h2>
    </div>
    <div class="category-grid">
      <div class="category-item" v-for="cat in categories" :key="cat.id" @click="filterByCategory(cat.id)">
        <img :src="cat.icon || 'https://picsum.photos/80/80?random=' + cat.id" class="category-icon" />
        <span class="category-name">{{ cat.name }}</span>
      </div>
    </div>
    <div class="video-section" v-if="selectedCategory">
      <h3>分类视频 <button @click="showAll" class="show-all-btn">查看全部</button></h3>
      <div class="video-grid">
        <div class="video-item" v-for="video in categoryVideos" :key="video.id" @click="goToVideo(video.id)">
          <div class="thumbnail"><img :src="'https://picsum.photos/300/200?random=' + video.id" /></div>
          <div class="info"><h4>{{ video.name }}</h4><p>{{ video.author }} · {{ formatViews(video.views) }}</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return { categories: [], selectedCategory: null, categoryVideos: [] }
  },
  mounted() { this.fetchCategories(); },
  methods: {
    async fetchCategories() {
      try {
        const res = await fetch('http://localhost:8080/categories');
        this.categories = await res.json();
      } catch (e) { console.error('获取分类失败:', e); }
    },
    async filterByCategory(id) {
      this.selectedCategory = id;
      try {
        const res = await fetch('http://localhost:8080/videos?category_id=' + id);
        const data = await res.json();
        this.categoryVideos = data.list || data;
      } catch (e) { console.error('获取分类视频失败:', e); }
    },
    showAll() { this.selectedCategory = null; this.categoryVideos = []; },
    goToVideo(id) { this.$router.push('/video/' + id); },
    formatViews(v) { return v >= 10000 ? (v / 10000).toFixed(1) + '万' : v; }
  }
}
</script>

<style scoped>
.categories { padding: 20px; max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.back-btn { padding: 8px 16px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.category-grid { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
.category-item { display: flex; flex-direction: column; align-items: center; padding: 15px; border-radius: 12px; cursor: pointer; transition: all 0.3s; width: 100px; }
.category-item:hover { background: #f0f0f0; }
.category-icon { width: 56px; height: 56px; border-radius: 50%; margin-bottom: 8px; }
.category-name { font-size: 13px; text-align: center; }
.video-section h3 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.show-all-btn { padding: 5px 12px; font-size: 12px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 15px; }
.video-item { border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.3s; }
.video-item:hover { transform: translateY(-3px); }
.thumbnail { width: 100%; height: 160px; overflow: hidden; }
.thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.info { padding: 10px; }
.info h4 { font-size: 14px; margin-bottom: 4px; }
.info p { font-size: 12px; color: #666; }
</style>