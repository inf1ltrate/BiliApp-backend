<template>
  <div class="orders">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>充电订单</h2>
    </div>
    <div class="filter-bar">
      <button :class="{ active: filter === '' }" @click="filter = ''">全部</button>
      <button :class="{ active: filter === '1' }" @click="filter = '1'">已支付</button>
      <button :class="{ active: filter === '0' }" @click="filter = '0'">待支付</button>
      <button :class="{ active: filter === '2' }" @click="filter = '2'">已取消</button>
    </div>
    <div class="order-list">
      <div class="order-item" v-for="order in filteredOrders" :key="order.id">
        <div class="order-top">
          <span class="order-no">{{ order.order_no }}</span>
          <span :class="['status', 'status-' + order.status]">{{ statusText(order.status) }}</span>
        </div>
        <div class="order-bottom">
          <span class="amount">¥{{ order.amount }}</span>
          <span class="time">{{ formatTime(order.created_at) }}</span>
        </div>
        <button v-if="order.status === 0" class="pay-btn" @click="payOrder(order.id)">立即支付</button>
      </div>
      <div class="empty" v-if="filteredOrders.length === 0">暂无订单</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return { orders: [], filter: '' }
  },
  computed: {
    filteredOrders() {
      return this.filter === '' ? this.orders : this.orders.filter(o => o.status == this.filter);
    }
  },
  mounted() { this.fetchOrders(); },
  methods: {
    async fetchOrders() {
      try {
        const res = await fetch('http://localhost:8080/orders');
        this.orders = await res.json();
      } catch (e) { console.error('获取订单失败:', e); }
    },
    async payOrder(id) {
      try {
        await fetch('http://localhost:8080/orders/' + id + '/status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 1 })
        });
        this.fetchOrders();
      } catch (e) { console.error('支付失败:', e); }
    },
    statusText(s) { return { 0: '待支付', 1: '已支付', 2: '已取消' }[s] || '未知'; },
    formatTime(t) { return t ? new Date(t).toLocaleString('zh-CN') : ''; }
  }
}
</script>

<style scoped>
.orders { padding: 20px; max-width: 800px; margin: 0 auto; }
.page-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.back-btn { padding: 8px 16px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.filter-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.filter-bar button { padding: 6px 16px; border: 1px solid #e0e0e0; background: white; border-radius: 20px; cursor: pointer; }
.filter-bar button.active { background: #ff6699; color: white; border-color: #ff6699; }
.order-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 10px; }
.order-top { display: flex; flex-direction: column; }
.order-no { font-size: 13px; color: #666; }
.status { font-size: 12px; padding: 2px 8px; border-radius: 4px; margin-top: 5px; }
.status-1 { background: #e6f7ff; color: #1890ff; }
.status-0 { background: #fff7e6; color: #faad14; }
.status-2 { background: #f5f5f5; color: #999; }
.order-bottom .amount { font-size: 18px; font-weight: 600; }
.order-bottom .time { font-size: 12px; color: #999; margin-left: 10px; }
.pay-btn { padding: 6px 14px; background: #ff6699; color: white; border: none; border-radius: 4px; cursor: pointer; }
.empty { text-align: center; padding: 40px; color: #999; }
</style>