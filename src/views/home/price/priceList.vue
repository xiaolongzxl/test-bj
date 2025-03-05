<template>
  <el-drawer v-model="drawerPriseList" direction="rtl" :with-header="false" size="1280">
    <template #default>
      <div class="drawer-content">
        <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="dialogInfoVisible = false" />
        <div class="drawer-title pt-24 pb-34">
          <img :src="$getAssetsImages('price/icon-title2.png')" alt="" @click="dialogInfoVisible = false" class="mr-10" />
          <span @click="drawerPriseDetail = true">报价记录</span>
        </div>
        <div class="px-40 pb-64 search-box" style="height: calc(100% - 84px)">
          <div class="card-label mb-24"> 条件筛选： </div>
          <div class="mb-30 flex">
            <div class="label">关键字查询：</div>
            <el-input v-model="listKeyword" placeholder="请输入关键字进行查询...">
              <template #suffix> <img :src="$getAssetsImages('price/icon-search2.png')" alt="" class="mr-4" /> <span>搜索</span></template>
            </el-input>
            <div class="label ml-40">日期筛选： </div>
            <el-date-picker v-model="listTime" style="width: 340px" type="date" placeholder="请选择日期" clearable> </el-date-picker>
          </div>
          <div class="card-label mb-24"> 报价记录列表： </div>
          <div class="list-card mb-34" style="height: calc(100% - 220px)">
            <el-table :data="ListData" style="width: 100%" height="100%" ref="tableRef" table-layout="fixed" :cell-style="{ 'text-align': 'center' }">
              <el-table-column label="金额">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="客户名称" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="订单编号" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="报价人" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="报价时间" prop="price">
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template #default="scope">
                  <div class="table-btn flex-center">
                    <div class="ml-4" @click="drawerPriseDetail = true">详情</div>
                    <div class="ml-4" @click="handleCopy(scope.row.name)">加入报价单</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex-center"> <el-pagination background layout="prev, pager, next" :total="1000" /> </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const drawerPriseList = defineModel('drawerPriseList');
</script>

<style lang="less" scoped></style>
