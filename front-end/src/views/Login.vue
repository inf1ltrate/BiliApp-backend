<template>
  <div class="login">
    <div class="login-container">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="form.username" required />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>
      <div class="back-link">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        // 这里简化处理，实际应该调用登录接口
        // 由于后端没有专门的登录接口，我们这里模拟登录成功
        // 实际项目中应该调用后端的登录验证接口
        console.log('登录信息:', this.form);
        alert('登录成功！');
        this.$router.push('/');
      } catch (error) {
        console.error('登录失败:', error);
        alert('登录失败，请检查用户名和密码');
      }
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-container h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #00a1d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0081b6;
}

.back-link {
  margin-top: 20px;
  text-align: center;
}

.back-link a {
  color: #00a1d6;
  text-decoration: none;
  font-size: 14px;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>