<template>
  <div>
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
              <el-table
                :data="ListData"
                style="width: 100%"
                height="100%"
                ref="tableRef"
                table-layout="fixed"
                :cell-style="{ 'text-align': 'center' }"
              >
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
    <el-drawer v-model="drawerPriseDetail" direction="rtl" :with-header="false" size="1280">
      <template #default>
        <div class="drawer-content">
          <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="dialogInfoVisible = false" />
          <div class="drawer-title pt-24 pb-34">
            <img :src="$getAssetsImages('price/icon-title2.png')" alt="" @click="dialogInfoVisible = false" class="mr-10" />
            <span @click="drawerPriseDetail = true">报价记录</span>
          </div>
          <div class="px-40 pb-64 search-box" style="height: calc(100% - 84px)">
            <div class="flex">
              <div class="label">项目名称：</div>
              <div class="value">这里是项目名称这里是项目名称这里是项目名称这里是项目名称这里是项目名称</div>
            </div>
            <div style="height: 1px; background: #ececec; border-radius: 4px 4px 4px 4px" class="my-20"></div>
            <div class="mb-30 flex">
              <div style="flex: 0 0 30%" flex>
                <div class="label">客户名称：</div>
                <div class="value">这里是客户名称这里是客户名称</div>
              </div>
              <div style="flex: 0 0 25%" flex>
                <div class="label">订单编号：</div>
                <div class="value">WDDL-20241218-0001</div>
              </div>
              <div style="flex: 0 0 25%" flex>
                <div class="label">报价日期：</div>
                <div class="value">2024-01-13 15:48:56</div>
              </div>
              <div style="flex: 0 0 20%" flex>
                <div class="label">报价人：</div>
                <div class="value">李晨光</div>
              </div>
            </div>
            <div style="height: calc(100% - 220px)">
              <el-table
                :data="detailList"
                style="width: 100%; border-radius: 8px 8px 0px 0px"
                height="100%"
                ref="tableRef"
                table-layout="fixed"
                :cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column label="序号">
                  <template #default="scope">
                    <div class="table-name">{{ scope.row.index }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="产品名称">
                  <template #default="scope">
                    <div class="table-name">{{ scope.row.name }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="型号规格">
                  <template #default="scope">
                    <div class="table-name">{{ scope.row.specs }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template #default="scope">
                    <div class="table-name">{{ scope.row.num }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="单价">
                  <template #default="scope">
                    <div class="table-name">{{ scope.row.price }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="合计总价">
                  <template #default="scope">
                    <div class="table-name">{{ scope.row.total }}</div>
                  </template>
                </el-table-column>

                <!-- <el-table-column label="专票" >
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="含税总价" >
                <template #default="scope">
                  <div class="table-name">{{ scope.row.name }}</div>
                </template>
              </el-table-column> -->
              </el-table>
            </div>
            <div class="table-bottom flex-between px-46 mb-20">
              <div class="flex">
                <div class="flex mr-36">
                  <span class="label1">铜价:</span>
                  <span class="label2 ml-6">7624.00元/吨</span>
                </div>
                <div class="flex">
                  <span class="label1">铝价:</span>
                  <span class="label2 ml-6">19800.00元/吨</span>
                </div>
              </div>
              <div class="flex">
                <div class="flex mr-36">
                  <span class="label2">含税总价:</span>
                  <span class="value2 ml-6">￥18568</span>
                </div>
                <div class="flex">
                  <span class="label2">合计总价：</span>
                  <span class="value2 ml-6">￥167668</span>
                </div>
              </div>
            </div>
            <div class="flex-end">
              <div class="export-btn flex-center px-10 ml-12">
                <img :src="$getAssetsImages('price/icon-bjdyl.png')" alt="" class="mr-8" />
                <span>报价单预览</span>
              </div>
              <div class="export-btn flex-center px-10 ml-12">
                <img :src="$getAssetsImages('price/icon-bjdyl.png')" alt="" class="mr-8" />
                <span>导出图片</span>
              </div>
              <div class="export-btn flex-center px-10 ml-12">
                <img :src="$getAssetsImages('price/icon-pdf.png')" alt="" class="mr-8" />
                <span>导出pdf</span>
              </div>
              <div class="export-btn flex-center px-10 ml-12">
                <img :src="$getAssetsImages('price/icon-excel.png')" alt="" class="mr-8" />
                <span>导出excel</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped></style>
