<template>
  <div class="home">
    <!-- 顶部标题栏 -->
    <div class="header">
      <h1 class="logo">哔哩哔哩</h1>
      <div v-if="isLoggedIn" class="user-avatar-wrap" @click="$router.push('/profile')">
        <img :src="userInfo.avatar" class="user-avatar" />
      </div>
      <div v-else class="login-link" @click="$router.push('/login')">登录</div>
    </div>

    <!-- 轮播图 -->
    <div class="carousel" v-if="carousels.length > 0">
      <div class="carousel-item" v-for="(item, i) in carousels" :key="item.id" :class="{ active: i === curIdx }">
        <img :src="item.pic || 'https://picsum.photos/800/300?random=' + item.id" />
        <div class="carousel-adv">{{ item.adv }}</div>
      </div>
      <div class="carousel-dots">
        <span v-for="(item, i) in carousels" :key="item.id" :class="{ active: i === curIdx }" @click="curIdx = i"></span>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="grid-nav">
      <div class="grid-item" @click="$router.push('/categories')"><span class="icon">📂</span><span>分类</span></div>
      <div class="grid-item" @click="$router.push('/comments')"><span class="icon">💬</span><span>评论</span></div>
      <div class="grid-item" @click="$router.push('/likes')"><span class="icon">❤</span><span>点赞</span></div>
      <div class="grid-item" @click="$router.push('/orders')"><span class="icon">📋</span><span>订单</span></div>
      <div class="grid-item" @click="$router.push('/reviews')"><span class="icon">⭐</span><span>评价</span></div>
      <div class="grid-item" @click="$router.push('/profile')"><span class="icon">👤</span><span>我的</span></div>
    </div>

    <!-- 推荐视频 -->
    <div class="video-section">
      <h3>推荐视频</h3>
      <div class="video-list">
        <div class="video-card" v-for="v in videos" :key="v.id" @click="$router.push('/video/' + v.id)">
          <div class="video-cover">
            <img :src="v.thumb || 'https://picsum.photos/400/225?random=' + v.id" />
            <span class="play-count">{{ formatNum(v.views) }}</span>
          </div>
          <div class="video-meta">
            <h4>{{ v.name }}</h4>
            <p>{{ v.author }} · {{ v.category_name || '综合' }}</p>
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
      curIdx: 0,
      timer: null
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('bilibili_user');
    },
    userInfo() {
      const u = localStorage.getItem('bilibili_user');
      return u ? JSON.parse(u) : {};
    }
  },
  mounted() {
    this.fetchData();
    this.startAuto();
  },
  methods: {
    async fetchData() {
      try {
        const [cRes, vRes] = await Promise.all([
          fetch('http://localhost:8080/carousels'),
          fetch('http://localhost:8080/videos?limit=20')
        ]);
        this.carousels = await cRes.json();
        const vData = await vRes.json();
        this.videos = vData.list || vData;
      } catch (e) {
        console.error('获取数据失败:', e);
      }
    },
    startAuto() {
      this.timer = setInterval(() => {
        this.curIdx = (this.curIdx + 1) % this.carousels.length;
      }, 3000);
    },
    formatNum(n) {
      return n >= 10000 ? (n / 10000).toFixed(1) + '万' : n;
    }
  }
}
</script>

<style scoped>
.home { padding: 0 12px 12px; }

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px 10px;
}
.logo { font-size: 20px; color: #ff6699; font-weight: 600; }
.user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 1.5px solid #ff6699;
}
.login-link {
  font-size: 14px;
  color: #ff6699;
  cursor: pointer;
}

.carousel {
  width: 100%;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 15px;
}
.carousel-item {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0;
  transition: opacity 0.5s;
}
.carousel-item.active { opacity: 1; }
.carousel-item img { width: 100%; height: 100%; object-fit: cover; }
.carousel-adv {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 8px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  color: white;
  font-size: 13px;
}
.carousel-dots {
  position: absolute;
  bottom: 30px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 6px;
}
.carousel-dots span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
}
.carousel-dots span.active { background: white; }

.grid-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}
.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}
.grid-item:active { transform: scale(0.95); }
.grid-item .icon { font-size: 22px; margin-bottom: 6px; }
.grid-item span:last-child { font-size: 12px; color: #666; }

.video-section { padding: 0; }
.video-section h3 {
  font-size: 16px;
  padding: 10px 4px 12px;
}
.video-list { display: flex; flex-direction: column; gap: 12px; }
.video-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}
.video-card:active { transform: scale(0.98); }
.video-cover {
  width: 100%;
  height: 195px;
  overflow: hidden;
  position: relative;
}
.video-cover img { width: 100%; height: 100%; object-fit: cover; }
.play-count {
  position: absolute;
  bottom: 8px; left: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.video-meta { padding: 10px 12px; }
.video-meta h4 { font-size: 14px; margin-bottom: 4px; line-height: 1.4; }
.video-meta p { font-size: 12px; color: #999; }
</style>