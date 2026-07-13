<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <div class="header">
      <h1 class="logo">哔哩哔哩</h1>
      <div class="nav">
        <router-link to="/categories">分类</router-link>
        <router-link to="/comments">评论</router-link>
        <router-link to="/likes">点赞</router-link>
        <router-link to="/orders">订单</router-link>
        <router-link to="/reviews">评价</router-link>
      </div>
      <router-link to="/login" class="login-btn">登录</router-link>
    </div>

    <!-- 轮播图 -->
    <div class="carousel" v-if="carousels.length > 0">
      <div class="carousel-item" v-for="(carousel, index) in carousels" :key="carousel.id" :class="{ active: index === currentIndex }">
        <img :src="'https://picsum.photos/800/400?random=' + carousel.id" :alt="carousel.adv" />
        <div class="carousel-adv">{{ carousel.adv }}</div>
      </div>
      <div class="carousel-indicators">
        <span v-for="(carousel, index) in carousels" :key="carousel.id" :class="{ active: index === currentIndex }" @click="currentIndex = index"></span>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="feature-grid">
      <router-link to="/categories" class="feature-item"><span class="icon">📂</span><span>视频分类</span></router-link>
      <router-link to="/comments" class="feature-item"><span class="icon">💬</span><span>最新评论</span></router-link>
      <router-link to="/likes" class="feature-item"><span class="icon">❤</span><span>我的点赞</span></router-link>
      <router-link to="/orders" class="feature-item"><span class="icon">📋</span><span>充电订单</span></router-link>
      <router-link to="/reviews" class="feature-item"><span class="icon">⭐</span><span>用户评价</span></router-link>
    </div>

    <!-- 视频列表 -->
    <div class="video-list">
      <h2>推荐视频</h2>
      <div class="video-grid">
        <div class="video-item" v-for="video in videos" :key="video.id" @click="goToVideo(video.id)">
          <div class="video-thumbnail">
            <img :src="'https://picsum.photos/300/200?random=' + video.id" :alt="video.name" />
            <span class="views">{{ formatViews(video.views) }}</span>
          </div>
          <div class="video-info">
            <h3>{{ video.name }}</h3>
            <p>{{ video.author }} · {{ video.category_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      carousels: [],
      videos: [],
      currentIndex: 0
    }
  },
  mounted() {
    this.fetchCarousels();
    this.fetchVideos();
    this.startCarousel();
  },
  methods: {
    startCarousel() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.carousels.length;
      }, 3000);
    },
    async fetchCarousels() {
      try {
        const response = await fetch('http://localhost:8080/carousels');
        this.carousels = await response.json();
      } catch (error) {
        console.error('获取轮播图失败:', error);
      }
    },
    async fetchVideos() {
      try {
        const response = await fetch('http://localhost:8080/videos');
        const data = await response.json();
        this.videos = data.list || data;
      } catch (error) {
        console.error('获取视频列表失败:', error);
      }
    },
    goToVideo(id) {
      this.$router.push('/video/' + id);
    },
    formatViews(v) {
      return v >= 10000 ? (v / 10000).toFixed(1) + '万' : v;
    }
  }
}
</script>

<style scoped>
.home { padding: 0 20px 40px; }
.header { display: flex; align-items: center; padding: 15px 0; margin-bottom: 15px; border-bottom: 1px solid #eee; }
.logo { font-size: 24px; color: #ff6699; margin-right: 30px; }
.nav { display: flex; gap: 20px; flex: 1; }
.nav a { text-decoration: none; color: #333; font-size: 14px; padding: 5px 10px; }
.nav a:hover { color: #ff6699; }
.login-btn { padding: 6px 16px; background: #ff6699; color: white; text-decoration: none; border-radius: 20px; font-size: 14px; }

.carousel { width: 100%; height: 250px; overflow: hidden; margin-bottom: 30px; position: relative; border-radius: 8px; }
.carousel-item { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.5s ease; }
.carousel-item.active { opacity: 1; }
.carousel-item img { width: 100%; height: 100%; object-fit: cover; }
.carousel-indicators { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
.carousel-indicators span { width: 10px; height: 10px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.5); cursor: pointer; transition: background-color 0.3s ease; }
.carousel-indicators span.active { background-color: white; }
.carousel-adv { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.5); color: white; padding: 10px; font-size: 16px; }

.feature-grid { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
.feature-item { display: flex; flex-direction: column; align-items: center; padding: 15px 20px; background: #f9f9f9; border-radius: 12px; text-decoration: none; color: #333; min-width: 80px; transition: all 0.3s; }
.feature-item:hover { background: #fff0f5; transform: translateY(-2px); }
.feature-item .icon { font-size: 24px; margin-bottom: 5px; }

.video-list h2 { margin-bottom: 20px; font-size: 22px; }
.video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
.video-item { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.3s ease; }
.video-item:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
.video-thumbnail { width: 100%; height: 170px; overflow: hidden; position: relative; }
.video-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.views { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.video-info { padding: 12px; }
.video-info h3 { margin-bottom: 5px; font-size: 15px; }
.video-info p { color: #666; font-size: 13px; }
</style>