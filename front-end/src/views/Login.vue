<template>
  <div class="login-page">
    <div class="back-bar">
      <button class="back-btn" @click="$router.back()">← 返回</button>
    </div>

    <div class="login-header">
      <h1>哔哩哔哩</h1>
      <p>登录或注册账号</p>
    </div>

    <div class="login-form">
      <div class="login-tabs">
        <span :class="{ active: isLogin }" @click="isLogin = true">登录</span>
        <span :class="{ active: !isLogin }" @click="isLogin = false">注册</span>
      </div>

      <form v-if="isLogin" @submit.prevent="handleLogin" class="form">
        <div class="input-group">
          <span class="input-icon">👤</span>
          <input type="text" v-model="loginForm.username" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <span class="input-icon">🔒</span>
          <input type="password" v-model="loginForm.password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="submit-btn">登录</button>
      </form>

      <form v-else @submit.prevent="handleRegister" class="form">
        <div class="input-group">
          <span class="input-icon">👤</span>
          <input type="text" v-model="regForm.username" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <span class="input-icon">🔒</span>
          <input type="password" v-model="regForm.password" placeholder="请输入密码" required />
        </div>
        <div class="input-group">
          <span class="input-icon">✎</span>
          <input type="text" v-model="regForm.nickname" placeholder="请输入昵称" />
        </div>
        <button type="submit" class="submit-btn">注册</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isLogin: true,
      loginForm: { username: '', password: '' },
      regForm: { username: '', password: '', nickname: '' }
    }
  },
  methods: {
    async handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        alert('请输入用户名和密码');
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('bilibili_user', JSON.stringify(data.user));
          alert('登录成功！');
          this.$router.push('/');
        } else {
          alert(data.error || '登录失败');
        }
      } catch (e) {
        console.error('登录失败:', e);
        alert('登录失败，请检查网络');
      }
    },
    async handleRegister() {
      if (!this.regForm.username || !this.regForm.password) {
        alert('用户名和密码不能为空');
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.regForm)
        });
        const data = await res.json();
        if (res.ok) {
          alert('注册成功，请登录');
          this.isLogin = true;
        } else {
          alert(data.error || '注册失败');
        }
      } catch (e) {
        console.error('注册失败:', e);
      }
    }
  }
}
</script>

<style scoped>
.login-page { background: #f4f4f4; min-height: 100vh; padding-bottom: 20px; }
.back-bar { padding: 12px; }
.back-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: #333; }

.login-header { text-align: center; padding: 50px 0 30px; }
.login-header h1 { font-size: 28px; color: #ff6699; margin-bottom: 10px; }
.login-header p { color: #999; font-size: 14px; }

.login-form { background: white; margin: 0 16px; border-radius: 12px; padding: 24px 20px; }
.login-tabs { display: flex; justify-content: center; gap: 30px; margin-bottom: 24px; }
.login-tabs span { padding: 8px 0; font-size: 16px; color: #999; cursor: pointer; border-bottom: 2px solid transparent; }
.login-tabs span.active { color: #ff6699; border-bottom-color: #ff6699; }

.form .input-group { display: flex; align-items: center; background: #f5f5f5; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
.input-icon { margin-right: 10px; font-size: 18px; }
.input-group input { flex: 1; border: none; background: none; font-size: 15px; outline: none; }

.submit-btn { width: 100%; padding: 14px; background: #ff6699; color: white; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; margin-top: 10px; }
.submit-btn:active { opacity: 0.85; }
</style>