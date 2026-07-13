<template>
  <div class="video-detail">
    <div class="back-btn">
      <router-link to="/">返回首页</router-link>
    </div>
    
    <div class="video-content" v-if="video">
      <h1>{{ video.name }}</h1>
      <p class="author">作者：{{ video.author }}</p>
      <div class="video-player">
        <video :src="video.url" controls width="100%" height="400px"></video>
      </div>
    </div>
    
    <div class="loading" v-else>
      加载中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoDetail',
  data() {
    return {
      video: null
    }
  },
  mounted() {
    this.fetchVideo();
  },
  methods: {
    async fetchVideo() {
      try {
        const { id } = this.$route.params;
        const response = await fetch(`http://localhost:8080/videos/${id}`);
        this.video = await response.json();
      } catch (error) {
        console.error('获取视频详情失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.video-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 20px;
}

.back-btn a {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-btn a:hover {
  background-color: #e0e0e0;
}

.video-content h1 {
  margin-bottom: 10px;
  font-size: 28px;
}

.author {
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
}

.video-player {
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}
</style>