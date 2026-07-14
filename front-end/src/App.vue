<template>
  <div class="app">
    <router-view />
    <!-- 底部导航栏 -->
    <div class="tab-bar">
      <div class="tab-item" :class="{ active: isRoute('/') }" @click="go('/')">
        <div class="tab-icon">⌂</div>
        <div class="tab-text">首页</div>
      </div>
      <div class="tab-item" :class="{ active: isRoute('/categories') }" @click="go('/categories')">
        <div class="tab-icon">▣</div>
        <div class="tab-text">分类</div>
      </div>
      <div class="tab-item" :class="{ active: isRoute('/orders') }" @click="go('/orders')">
        <div class="tab-icon">📋</div>
        <div class="tab-text">订单</div>
      </div>
      <div class="tab-item" :class="{ active: isRoute('/profile') }" @click="go('/profile')">
        <div class="tab-icon">👤</div>
        <div class="tab-text">我的</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    isRoute(path) {
      return this.$route.path === path;
    },
    go(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #f4f4f4;
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  padding-bottom: 56px;
  background: #f4f4f4;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 56px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.tab-item.active {
  color: #ff6699;
}

.tab-icon {
  font-size: 22px;
  margin-bottom: 2px;
  line-height: 1;
}

.tab-text {
  font-size: 10px;
}
</style>