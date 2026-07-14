<template>
  <div class="video-detail">
    <!-- 返回按钮 -->
    <div class="back-bar">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <span class="video-title" v-if="video">{{ video.name }}</span>
    </div>

    <div v-if="video" class="content">
      <!-- 视频播放器 -->
      <div class="player-wrap">
        <video
          :src="video.url"
          controls
          poster="https://picsum.photos/400/225?random=" + video.id
          preload="metadata"
          class="player"
        ></video>
      </div>

      <!-- 视频信息 -->
      <div class="info-card">
        <h3>{{ video.name }}</h3>
        <div class="info-row">
          <span class="author">👤 {{ video.author }}</span>
          <span class="stats">▶ {{ formatNum(video.views) }} 次播放</span>
          <span class="stats">❤ {{ formatNum(video.likes) }} 点赞</span>
        </div>
      </div>

      <!-- 评论入口 -->
      <div class="action-bar">
        <button class="action-btn" @click="$router.push('/comments')">💬 全部评论 ({{ video.likes || 0 }})</button>
        <button class="action-btn primary" @click="handleLike">❤ 点赞</button>
      </div>
    </div>

    <div v-else class="loading">
      <p>🎬 正在加载视频...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoDetail',
  data() {
    return { video: null }
  },
  mounted() {
    this.fetchVideo();
  },
  methods: {
    async fetchVideo() {
      try {
        const id = this.$route.params.id;
        const res = await fetch('http://localhost:8080/videos/' + id);
        this.video = await res.json();
      } catch (e) {
        console.error('获取视频失败:', e);
      }
    },
    async handleLike() {
      try {
        await fetch('http://localhost:8080/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 1, video_id: this.video.id })
        });
        alert('点赞成功 ❤');
        this.fetchVideo();
      } catch (e) {
        console.error('点赞失败:', e);
      }
    },
    formatNum(n) {
      return n >= 10000 ? (n / 10000).toFixed(1) + '万' : n;
    }
  }
}
</script>

<style scoped>
.video-detail { background: #f4f4f4; }
.back-bar {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: white;
}
.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #333;
  margin-right: 12px;
}
.video-title { font-size: 15px; font-weight: 500; }

.content { background: white; }
.player-wrap {
  width: 100%;
  background: #000;
}
.player {
  width: 100%;
  max-height: 220px;
  display: block;
}

.info-card { padding: 14px; }
.info-card h3 { font-size: 16px; margin-bottom: 10px; }
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.action-bar {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
}
.action-btn {
  flex: 1;
  padding: 10px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
.action-btn.primary { background: #fff0f5; color: #ff6699; }
</style>