<template>
  <div class="likes">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>我的点赞</h2>
    </div>
    <div class="like-list">
      <div class="like-item" v-for="video in likedVideos" :key="video.id" @click="goToVideo(video.id)">
        <div class="thumbnail"><img :src="'https://picsum.photos/300/200?random=' + video.id" /></div>
        <div class="info">
          <h4>{{ video.name }}</h4>
          <p>{{ video.author }}</p>
          <div class="actions">
            <span class="views">{{ formatViews(video.views) }} 播放</span>
            <span class="heart">❤ {{ video.likes }}</span>
          </div>
        </div>
      </div>
      <div class="empty" v-if="likedVideos.length === 0">还没有点赞过视频</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Likes',
  data() {
    return { likedVideos: [] }
  },
  mounted() { this.fetchLikes(); },
  methods: {
    async fetchLikes() {
      try {
        const res = await fetch('http://localhost:8080/videos?limit=20');
        const data = await res.json();
        this.likedVideos = (data.list || data).slice(0, 5);
      } catch (e) { console.error('获取点赞视频失败:', e); }
    },
    goToVideo(id) { this.$router.push('/video/' + id); },
    formatViews(v) { return v >= 10000 ? (v / 10000).toFixed(1) + '万' : v; }
  }
}
</script>

<style scoped>
.likes { padding: 20px; max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.back-btn { padding: 8px 16px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.like-list { display: flex; flex-direction: column; gap: 15px; }
.like-item { display: flex; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.3s; }
.like-item:hover { transform: translateY(-2px); box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
.thumbnail { width: 200px; height: 130px; overflow: hidden; }
.thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.info { flex: 1; padding: 15px; display: flex; flex-direction: column; justify-content: center; }
.info h4 { font-size: 16px; margin-bottom: 5px; }
.info p { font-size: 13px; color: #666; margin-bottom: 8px; }
.actions { display: flex; gap: 15px; font-size: 12px; color: #999; }
.heart { color: #ff6699; }
.empty { text-align: center; padding: 60px; color: #999; }
</style>