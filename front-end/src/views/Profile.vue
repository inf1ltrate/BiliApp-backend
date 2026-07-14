<template>
  <div class="profile">
    <!-- 登录状态：未登录 -->
    <div v-if="!isLoggedIn" class="login-banner">
      <p>登录后享受更多功能</p>
      <button class="login-btn" @click="$router.push('/login')">立即登录</button>
    </div>

    <!-- 登录状态：已登录 -->
    <div v-else class="user-header">
      <img :src="userInfo.avatar" class="user-avatar-big" />
      <h3>{{ userInfo.nickname }}</h3>
      <p class="user-id">ID: {{ userInfo.id }}</p>
    </div>

    <!-- 功能列表 -->
    <div class="menu-section">
      <h4 class="section-title">我的内容</h4>
      <div class="menu-item" @click="$router.push('/likes')">
        <span class="menu-icon">❤</span>
        <span class="menu-text">我的点赞</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/comments')">
        <span class="menu-icon">💬</span>
        <span class="menu-text">我的评论</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/orders')">
        <span class="menu-icon">📋</span>
        <span class="menu-text">充电订单</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <div class="menu-section">
      <h4 class="section-title">互动评价</h4>
      <div class="menu-item" @click="$router.push('/reviews')">
        <span class="menu-icon">⭐</span>
        <span class="menu-text">我的评价</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/categories')">
        <span class="menu-icon">📂</span>
        <span class="menu-text">视频分类</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <!-- 退出登录 -->
    <div v-if="isLoggedIn" class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('bilibili_user');
    },
    userInfo() {
      const user = localStorage.getItem('bilibili_user');
      return user ? JSON.parse(user) : { nickname: '', avatar: '', id: '' };
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('bilibili_user');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.profile { padding: 20px 16px; }
.login-banner {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}
.login-banner p { color: #666; margin-bottom: 20px; }
.login-btn {
  padding: 12px 50px;
  background: #ff6699;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}
.user-header {
  text-align: center;
  padding: 30px 0;
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
}
.user-avatar-big {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.user-header h3 { font-size: 18px; }
.user-id { font-size: 13px; color: #999; margin-top: 5px; }

.menu-section { margin-bottom: 15px; }
.section-title {
  font-size: 13px;
  color: #999;
  padding: 10px 4px;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 4px;
  background: white;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.menu-item:first-of-type { border-top: 1px solid #f5f5f5; }
.menu-item:last-of-type { border-radius: 0 0 8px 8px; }
.menu-icon { font-size: 20px; margin-right: 12px; width: 28px; }
.menu-text { flex: 1; font-size: 15px; }
.menu-arrow { color: #ccc; font-size: 20px; }

.logout-section { margin-top: 20px; }
.logout-btn {
  width: 100%;
  padding: 14px;
  background: white;
  border: none;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 15px;
  cursor: pointer;
}
</style>