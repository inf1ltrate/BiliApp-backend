<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>充电订单</h2>
    </div>
    <div class="filter-bar">
      <button :class="{ active: f === '' }" @click="f = ''">全部</button>
      <button :class="{ active: f === '1' }" @click="f = '1'">已支付</button>
      <button :class="{ active: f === '0' }" @click="f = '0'">待支付</button>
      <button :class="{ active: f === '2' }" @click="f = '2'">已取消</button>
    </div>
    <div class="order-list">
      <div class="order-card" v-for="o in list" :key="o.id">
        <div class="o-top">
          <span class="o-no">{{ o.order_no }}</span>
          <span :class="['st', 'st-' + o.status]">{{ status(o.status) }}</span>
        </div>
        <div class="o-bottom">
          <span class="amt">¥{{ o.amount }}</span>
          <span class="tm">{{ format(o.created_at) }}</span>
          <button v-if="o.status === 0" class="pay" @click="pay(o.id)">支付</button>
        </div>
      </div>
      <div class="empty" v-if="list.length === 0">暂无订单</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Orders',
  data() { return { orders: [], f: '' } },
  computed: { list() { return this.f === '' ? this.orders : this.orders.filter(o => o.status == this.f); } },
  mounted() { this.fetch(); },
  methods: {
    async fetch() { try { const r = await fetch('http://localhost:8080/orders'); this.orders = await r.json(); } catch (e) {} },
    async pay(id) {
      try {
        await fetch('http://localhost:8080/orders/' + id + '/status', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 1 }) });
        this.fetch();
      } catch (e) {}
    },
    status(s) { return { 0: '待支付', 1: '已支付', 2: '已取消' }[s] || '未知'; },
    format(t) { return t ? new Date(t).toLocaleString('zh-CN') : ''; }
  }
}
</script>
<style scoped>
.page { background: #f4f4f4; }
.page-header { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: white; }
.back-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: #333; }
.page-header h2 { font-size: 16px; }
.filter-bar { display: flex; gap: 8px; padding: 10px 12px; }
.filter-bar button { padding: 5px 14px; border: 1px solid #eee; background: white; border-radius: 16px; font-size: 13px; cursor: pointer; }
.filter-bar button.active { background: #ff6699; color: white; border-color: #ff6699; }
.order-list { padding: 0 12px; }
.order-card { background: white; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
.o-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
.o-no { font-size: 13px; color: #666; }
.st { font-size: 11px; padding: 2px 8px; border-radius: 4px; }
.st-1 { background: #e6f7ff; color: #1890ff; }
.st-0 { background: #fff7e6; color: #faad14; }
.st-2 { background: #f5f5f5; color: #999; }
.o-bottom { display: flex; align-items: center; gap: 12px; }
.amt { font-size: 18px; font-weight: 600; }
.tm { flex: 1; font-size: 12px; color: #999; }
.pay { padding: 6px 16px; background: #ff6699; color: white; border: none; border-radius: 16px; cursor: pointer; }
.empty { text-align: center; padding: 40px; color: #999; }
</style>