<template>
  <div class="left-navbar">
    <div class="top-navbar-self">
      <div @click="showCategoryBox" class="flex-between pl-15 pr-11 cursor-pointer w-100% h-100%">
        <div>{{ activeCateName }}</div>
        <img :src="$getAssetsImages('price/icon-more.png')" alt="" />
      </div>
      <div class="level-box scroll-none" v-if="showCategory" @click="closeCategoryBox">
        <div
          class="level-one px-8"
          :class="{ active: activeCateName == item.series_name }"
          v-for="item of category"
          :key="item.series_id"
          @click="changeCate(item)"
        >
          {{ item.series_name }}
        </div>
      </div>
      <div class="popup-box-bg z-99" v-if="showCategory" @click="closeCategoryBox"> </div>
    </div>
    <div style="height: calc(100% - 60px)" class="scroll-none">
      <el-tree
        node-key="id"
        :data="seriesData"
        :props="{
          children: 'series_type_list',
          label: 'name',
        }"
        :current-node-key="activeTypeId"
        @node-click="handleNodeClick"
        accordion
        highlight-current
        :auto-expand-parent="true"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="label" :class="data.series_type_list && data.series_type_list.length > 0 ? 'level1' : ''">{{ node.label }} </div>
            <div v-if="data.series_type_list && data.series_type_list.length > 0" class="pr-20">
              <img class="xiala" :src="$getAssetsImages('price/icon-xiala.png')" alt="" />
              <img class="huishou" :src="$getAssetsImages('price/icon-huishou.png')" alt="" />
            </div>
          </div> </template
      ></el-tree>
    </div>
  </div>
  <div class="right-content flex">
    <div class="list mr-10">
      <div class="search">
        <el-input
          placeholder=""
          v-model="keyword"
          clearable
          @focus="showSearchTable = true"
          style="position: relative; z-index: 88"
          @input="changeSearch"
        >
          <template #prefix>
            <img :src="$getAssetsImages('price/icon-search.png')" alt="" />
          </template>
        </el-input>
        <div class="search-table" v-if="showSearchTable">
          <div class="table-head flex-center">
            <div class="f-48 pl-30">产品名称</div>
            <div class="xian f-26 pl-8">型号</div>
            <div class="xian f-26 pl-8">规格</div>
          </div>
          <div class="table-body scroll-none">
            <div v-for="item of searchList" :key="item" class="table-tr flex-center" @click="changeSelect(item)">
              <div class="f-48 pl-30">{{ item.name }}</div>
              <div class="f-26 pl-8">{{ item.type_name }}</div>
              <div class="f-26 pl-8">{{ item.spec_name }}</div>
            </div>
          </div>
        </div>
        <div class="popup-box-bg z-66" v-if="showSearchTable" @click="closeSearchTable"> </div>
      </div>
      <div class="select-box flex-between">
        <el-dropdown trigger="click">
          <div class="select-gg flex-between px-14 cursor-pointer el-dropdown-link">
            <span class="text-over-1">全部</span>
            <img :src="$getAssetsImages('price/icon-shaixuan.png')" alt="" />
          </div>
          <template #dropdown>
            <el-dropdown-menu style="width: 210px">
              <el-dropdown-item class="select-type" :class="{ active: activeLabelId == '' }" @click="changeLabel('')">全部</el-dropdown-item>
              <el-dropdown-item
                class="select-type"
                v-for="item of labelList"
                :key="item.id"
                :class="{ active: activeLabelId == item.id }"
                @click="changeLabel(item.id)"
                >{{ item.title }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="select-btn flex-between cursor-pointer" @click="appendSelectToPrice">
          <img :src="$getAssetsImages('price/icon-pltj.png')" alt="" />
          <span mx-6>批量添加</span>
          <div class="num">{{ multipleSelection.length ? multipleSelection.length : '' }}</div>
        </div>
      </div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>{{ activeCateName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ activeSeriesName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ activeTypeName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="SeriesSpecList"
        row-key="spec_id"
        style="width: 100%"
        height="calc(100% - 216px)"
        class="self-hover-table"
        table-layout="fixed"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="selection" width="60" reserve-selection="true" />
        <el-table-column label="产品名称">
          <template #default="scope">
            <div class="table-name">{{ scope.row.spec_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price" width="90">
          <template #default="scope">
            <div class="flex-center">
              <div v-if="scope.row.isChange">{{ scope.row.spec_price }}</div>
              <el-input class="table-input" v-model="scope.row.spec_price" style="width: 80px" placeholder="1" v-else />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="number" width="90">
          <template #default="scope">
            <div class="flex-center">
              <el-input class="table-input" v-model="scope.row.number" style="width: 80px" placeholder="1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div class="table-btn flex-center">
              <div @click="handleCopy(scope.row.copy_name)" class="flex-center">
                <img :src="$getAssetsImages('price/icon-copy.png')" alt="" />
              </div>
              <div class="ml-4" @click="appendItemToPrice(scope.row)">加入报价单</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add-content">
      <div class="head-title flex-between px-20 mb-6">
        <div class="left-title">报价单</div>
        <div class="add-btns" @click="drawerPriseList = true">
          <img :src="$getAssetsImages('price/icon-record.png')" alt="" class="mr-4" />
          <span>报价记录</span>
        </div>
      </div>
      <div class="pa-20 flex-between">
        <el-radio-group v-model="radioType">
          <el-radio :value="0">单价</el-radio>
          <el-radio :value="1">专票</el-radio>
          <el-radio :value="2">普票</el-radio>
        </el-radio-group>
        <div class="flex">
          <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-red.png')" alt="" />
          </div>
          <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-blue.png')" alt="" />
          </div>
          <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-black.png')" alt="" />
          </div>
          <!-- <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-add.png')" alt="" class="mr-4" />
            <span>新增空白数据</span>
          </div> -->
          <div class="add-btns ml-10" @click="dialogTableVisible = true">
            <img :src="$getAssetsImages('price/icon-jgtz.png')" alt="" class="mr-4" />
            <span>价格调整</span>
          </div>
          <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-qingkong.png')" alt="" class="mr-4" />
            <span>清空报价单</span>
          </div>
          <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-qingkong.png')" alt="" class="mr-4" />
            <span>删除</span>
          </div>
        </div>
      </div>
      <div style="height: calc(100% - 198px)">
        <el-table
          row-key="spec_id"
          :data="quotationTableData"
          class="no-radius"
          style="width: 100%"
          height="100%"
          table-layout="fixed"
          highlight-current-row
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentChange"
        >
          <el-table-column label="" width="54" cell-class-name="center-cell">
            <template #default="scope">
              <div class="flex-center">
                <img :src="$getAssetsImages('price/icon-del-one.png')" alt="" @click="console.log(scope.row.id)" />
                <img :src="$getAssetsImages('price/icon-add-one.png')" alt="" class="ml-4" @click="console.log(scope.row.id)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="30" />
          <el-table-column label="序号" width="44">
            <template #default="scope">
              <div class="flex-center"> {{ scope.row.index }} </div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称">
            <template #default="scope">
              <el-input class="table-input" v-model="scope.row.name" placeholder="1" />
            </template>
          </el-table-column>
          <el-table-column label="型号规格" prop="price">
            <template #default="scope">
              <div class="flex-center">
                <el-input class="table-input" v-model="scope.row.spec" placeholder="1" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="number" width="90">
            <template #default="scope">
              <div class="flex-center">
                <el-input class="table-input" v-model="scope.row.unit" style="width: 80px" placeholder="1" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="number" width="90">
            <template #default="scope">
              <div class="flex-center">
                <el-input class="table-input" v-model="scope.row.price" style="width: 80px" placeholder="1" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="number" width="90">
            <template #default="scope">
              <div class="flex-center">
                <el-input class="table-input" v-model="scope.row.number" style="width: 80px" placeholder="1" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="number" width="90">
            <template #default="scope">
              <div class="flex-center"> {{ scope.row.money }} </div>
            </template>
          </el-table-column>
          <el-table-column label="备注信息" prop="number">
            <template #default="scope">
              <div class="flex-center">
                <el-input class="table-input" v-model="scope.row.remarks" placeholder="1" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot flex-between">
        <div class="flex-between cursor-default">
          <div class="foot-text ml-40">参考重量：150kg</div>
          <div class="foot-text ml-40">合计总价：</div>
          <div class="foot-price"><span>￥</span>2250.38</div>
        </div>
        <div class="foot-btn cursor-pointer" @click="drawerAddPrise = true">生成报价单</div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogTableVisible" width="375" class="dialog-self" :show-close="false" align-center>
    <img :src="$getAssetsImages('price/icon-close.png')" alt="" class="close" @click="dialogTableVisible = false" />
    <div class="dialog-title pt-27 pb-26">价格调整</div>
    <div class="px-46 mb-40">
      <div class="flex mb-20">
        <div class="text1">调价1：</div>
        <div class="flex-between operator-box mx-8">
          <img v-if="adjustPriceFrom.type1 == 1" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type1 = 1" />
          <img v-if="adjustPriceFrom.type1 == 0" :src="$getAssetsImages('price/chu-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type1 = 0" />
        </div>
        <el-input v-model="adjustPriceFrom.number1" class="adjust-input" placeholder="请输入调价系数"> </el-input>
      </div>
      <div class="flex mb-20">
        <div class="text1">调价2：</div>
        <div class="flex-between operator-box mx-8">
          <img v-if="adjustPriceFrom.type2 == 1" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type2 = 1" />
          <img v-if="adjustPriceFrom.type2 == 0" :src="$getAssetsImages('price/chu-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type2 = 0" />
        </div>
        <el-input v-model="adjustPriceFrom.number2" class="adjust-input" placeholder="请输入调价系数"> </el-input>
      </div>
      <div class="flex">
        <div class="text1">调价3：</div>
        <div class="flex-between operator-box mx-8">
          <img v-if="adjustPriceFrom.type3 == 1" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type3 = 1" />
          <img v-if="adjustPriceFrom.type3 == 0" :src="$getAssetsImages('price/chu-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type3 = 0" />
        </div>
        <el-input v-model="adjustPriceFrom.number3" class="adjust-input" placeholder="请输入调价系数"> </el-input>
      </div>
    </div>
    <div class="flex-center">
      <div class="dialog-btn mr-20">取消</div>
      <div class="dialog-btn confirm-btn">确定</div>
    </div>
  </el-dialog>
  <el-drawer v-model="drawerAddPrise" direction="rtl" :with-header="false" size="1280">
    <template #default>
      <div class="drawer-content">
        <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="drawerAddPrise = false" />
        <div class="drawer-title pt-24 pb-28">
          <img :src="$getAssetsImages('price/icon-title1.png')" alt="" class="mr-10" />
          <span>报价单详情页</span>
        </div>
        <div class="px-40 pb-64" style="height: calc(100% - 136px)">
          <div class="mb-20 flex search-box">
            <div class="label">报价日期：</div>
            <el-date-picker
              v-model="listKeyword"
              class="no-icon"
              type="datetime"
              placeholder="请选择"
              :default-time="new Date()"
              style="width: 220px"
            />
            <div class="label ml-24">订单编号： </div>
            <el-input style="width: 220px" value="WDDL-20241218-0001" disabled></el-input>
          </div>
          <div class="mb-14 flex search-box">
            <div class="label">项目名称：</div>
            <el-input v-model="listKeyword" placeholder="请输入" style="width: 220px"> </el-input>
            <div class="label ml-24">项目名称：</div>
            <el-input v-model="listKeyword" placeholder="请输入" style="width: 220px"> </el-input>
            <div class="label ml-24">项目名称：</div>
            <el-input v-model="listKeyword" placeholder="请输入" style="width: 220px"> </el-input>
          </div>
          <div class="card-label mb-20">报价明细： </div>
          <el-table
            row-key="spec_id"
            :data="quotationTableData"
            class="no-radius self-hover-table"
            style="width: 100%; border-radius: 0"
            height="402px"
            table-layout="fixed"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChange"
          >
            <el-table-column label="序号" width="44">
              <template #default="scope">
                <div class="flex-center"> {{ scope.row.index }} </div>
              </template>
            </el-table-column>
            <el-table-column label="产品名称">
              <template #default="scope">
                <el-input class="table-input" v-model="scope.row.name" placeholder="1" />
              </template>
            </el-table-column>
            <el-table-column label="型号规格" prop="price">
              <template #default="scope">
                <div class="flex-center">
                  <el-input class="table-input" v-model="scope.row.spec" placeholder="1" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center">
                  <el-input class="table-input" v-model="scope.row.unit" style="width: 80px" placeholder="1" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center">
                  <el-input class="table-input" v-model="scope.row.price" style="width: 80px" placeholder="1" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center">
                  <el-input class="table-input" v-model="scope.row.number" style="width: 80px" placeholder="1" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="金额" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center"> {{ scope.row.money }} </div>
              </template>
            </el-table-column>
            <el-table-column label="备注信息" prop="number">
              <template #default="scope">
                <div class="flex-center">
                  <el-input class="table-input" v-model="scope.row.remarks" placeholder="1" />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-18 flex">
            <div class="label">报价公司：</div>
            <div>
              <el-radio-group v-model="radioType">
                <el-radio :value="0"
                  ><img :src="$getAssetsImages('price/logo-company.png')" alt="" class="mr-6" />
                  <span>公司名称公司名称1</span>
                </el-radio>
                <el-radio :value="1">
                  <img :src="$getAssetsImages('price/logo-company.png')" alt="" class="mr-6" />
                  <span>公司名称公司名称1</span>
                </el-radio>
                <el-radio :value="2">
                  <img :src="$getAssetsImages('price/logo-company.png')" alt="" class="mr-6" />
                  <span>公司名称公司名称1</span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="mt-10 flex items-center">
            <div class="card-label">收货信息：</div>
            <div class="label">是否含运费：</div>
            <el-switch v-model="shippingCost" class="mx-14" style="--el-switch-on-color: #04b500" />
            <div style="font-size: 14px; color: #666666"> {{ shippingCost ? '是' : '否' }} </div>
          </div>
          <div class="mt-20 flex items-center search-box" v-if="shippingCost">
            <div class="label">收货地址：</div>
            <el-input v-model="listKeyword" placeholder="请输入" style="width: 430px"> </el-input>
          </div>
          <div class="mt-20 flex search-box">
            <div class="label">备注信息：</div>
            <div class="flex-columns">
              <el-input v-model="listKeyword" placeholder="请输入" style="width: 430px" class="mb-10">
                <template #prefix>
                  <div class="cursor-pointer">
                    <img :src="$getAssetsImages('price/Vector1.png')" alt="" v-if="isActive" @click="isActive = !isActive" />
                    <img :src="$getAssetsImages('price/Vector.png')" alt="" v-else @click="isActive = !isActive" />
                  </div>
                </template>
              </el-input>
              <el-input v-model="listKeyword" placeholder="请输入" style="width: 430px" class="mb-10">
                <template #prefix>
                  <div class="cursor-pointer">
                    <img :src="$getAssetsImages('price/Vector1.png')" alt="" v-if="isActive" @click="isActive = !isActive" />
                    <img :src="$getAssetsImages('price/Vector.png')" alt="" v-else @click="isActive = !isActive" />
                  </div>
                </template>
              </el-input>
              <el-input v-model="listKeyword" placeholder="请输入" style="width: 430px" class="mb-10">
                <template #prefix>
                  <div class="cursor-pointer">
                    <img :src="$getAssetsImages('price/Vector1.png')" alt="" v-if="isActive" @click="isActive = !isActive" />
                    <img :src="$getAssetsImages('price/Vector.png')" alt="" v-else @click="isActive = !isActive" />
                  </div>
                </template>
              </el-input>
              <el-input v-model="listKeyword" placeholder="请输入" style="width: 430px" class="mb-10">
                <template #prefix>
                  <div class="cursor-pointer">
                    <img :src="$getAssetsImages('price/Vector1.png')" alt="" v-if="isActive" @click="isActive = !isActive" />
                    <img :src="$getAssetsImages('price/Vector.png')" alt="" v-else @click="isActive = !isActive" />
                  </div>
                </template>
              </el-input>
              <el-input v-model="listKeyword" placeholder="请输入" style="width: 430px" class="mb-10">
                <template #prefix>
                  <div class="cursor-pointer">
                    <img :src="$getAssetsImages('price/Vector1.png')" alt="" v-if="isActive" @click="isActive = !isActive" />
                    <img :src="$getAssetsImages('price/Vector.png')" alt="" v-else @click="isActive = !isActive" />
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="foot flex-between" style="border-radius: 0">
          <div class="flex-between cursor-default">
            <div class="foot-text ml-40">参考重量：150kg</div>
            <div class="foot-text ml-40">数量合计：30</div>
            <div class="foot-text ml-40">未税：￥400.00</div>
            <div class="foot-text ml-40">税额：￥50.00</div>
            <div class="foot-text ml-40">合计总价：</div>
            <div class="foot-price"><span>￥</span>2250.38</div>
          </div>
          <div class="foot-btn2 mr-10 px-16">立即生成</div>
        </div>
      </div>
    </template>
  </el-drawer>
  <InfoDetail v-model:dialogInfoVisible="dialogInfoVisible" @append-item-to-price="appendItemToPrice" />
  <priceList
    v-if="drawerPriseList"
    v-model:drawerPriseList="drawerPriseList"
    @show-detail-drawer="showDetailDrawer"
    @reset-price-by-id="resetPriceById"
  />
  <priceDetail v-if="drawerPriseDetail" v-model:drawerPriseDetail="drawerPriseDetail" :priseDetailId="priseDetailId" />
</template>

<script setup lang="ts">
  import { getSeriesList, getSeriesSonList, seriesSpecSearch, getSeriesSpecList, getlabellist } from '@/api/price.ts';
  import { ArrowRight } from '@element-plus/icons-vue';
  import InfoDetail from './infoDetail.vue';
  import priceList from './priceList.vue';
  import priceDetail from './priceDetail.vue';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  // 一级分类
  onMounted(() => {
    getCategory();
  });
  const category = ref<any>([]);
  const activeCateName = ref<any>('');
  async function getCategory() {
    let res = await getSeriesList();
    if (res.code == 200) {
      category.value = res.data;
      changeCate(res.data[0]);
    }
  }
  const showCategory = ref<boolean>(false);
  function showCategoryBox() {
    showCategory.value = true;
  }
  function closeCategoryBox() {
    showCategory.value = false;
  }
  function changeCate(item: any) {
    activeCateName.value = item.series_name;
    getSeriesSonListCate(item.series_id, true);
  }
  // 二级分类
  const seriesData = ref<any>([]);
  const activeSeriesName = ref<any>(null);
  const activeTypeName = ref<any>(null);
  const activeTypeId = ref<any>(null);
  async function getSeriesSonListCate(series_id: any, flag: any) {
    let res = await getSeriesSonList({ series_id });
    if (res.code == 200) {
      seriesData.value = res.data.map((item: any) => {
        item.id = item.series_son_id;
        item.name = item.series_son_name;
        item.series_type_list = item.series_type_list.map((ite: any) => {
          ite.id = ite.type_id;
          ite.name = ite.type_name;
          return ite;
        });
        return item;
      });
      if (flag) {
        activeSeriesName.value = seriesData.value[0].series_son_name;
        activeTypeName.value = seriesData.value[0].series_type_list[0].type_name;
        activeTypeId.value = seriesData.value[0].series_type_list[0].id;
        getLabels(activeTypeId.value);
      }
      searchSeriesSpecList();
    }
  }
  // 切换三级
  function handleNodeClick(data: any, node: any) {
    if (data.type_id) {
      activeSeriesName.value = node.parent.label;
      activeTypeName.value = data.type_name;
      activeTypeId.value = data.type_id;
      activeLabelId.value = '';
      getLabels(data.type_id);
      searchSeriesSpecList();
    }
  }
  // 搜索
  const keyword = ref<any>(null);
  const showSearchTable = ref<boolean>(false);
  function closeSearchTable() {
    showSearchTable.value = false;
  }
  const timer = ref<any>(null);
  function changeSearch(e: any) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      searchByKeyword(e);
    }, 1000);
  }
  const searchList = ref<any>(null);
  async function searchByKeyword(word: any) {
    let res = await seriesSpecSearch({
      search: word,
      page: 1,
      limit: 99999,
    });
    if (res.code == 200) {
      searchList.value = res.data;
    } else {
      searchList.value = [];
    }
  }
  async function changeSelect(item: any) {
    activeSeriesName.value = item.series_son_name;
    activeTypeName.value = item.type_name;
    activeTypeId.value = item.type_id;
    activeCateName.value = item.series_name;
    keyword.value = null;
    showSearchTable.value = false;
    searchList.value = [];
    getLabels(activeTypeId.value);
    getSeriesSonListCate(item.series_id, false);
  }
  // 结构
  const activeLabelId = ref<any>('');
  const labelList = ref<any>([]);
  async function getLabels(id: any) {
    let res = await getlabellist({
      type_id: id,
    });

    if (res.code == 200) {
      labelList.value = res.data;
    } else {
      labelList.value = [];
    }
  }
  function changeLabel(labelId: any) {
    activeLabelId.value = labelId;
    searchSeriesSpecList();
  }
  // 规格列表
  const SeriesSpecList = ref<any>([]);
  async function searchSeriesSpecList() {
    let res = await getSeriesSpecList({
      type_id: activeTypeId.value,
      label_id: activeLabelId.value,
    });
    if (res.code == 200) {
      SeriesSpecList.value = res.data;
    } else {
      SeriesSpecList.value = [];
    }
  }
  const multipleSelection = ref<any>([]);
  function handleSelectionChange(val: any) {
    multipleSelection.value = val;
  }
  const currentRow = ref<any>();
  function handleCurrentChange(val: any) {
    currentRow.value = val;
  }
  async function handleCopy(text: any) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      $message({
        message: '复制成功',
        type: 'success',
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      $message({
        message: '复制成功',
        type: 'success',
      });
    }
  }
  async function appendItemToPrice(item: any) {
    console.log(item);
  }
  async function appendSelectToPrice() {
    console.log(multipleSelection.value);
  }
  //报价单
  const radioType = ref<any>(0);
  const quotationTableData = ref<any>([
    {
      id: 1,
      index: 1,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 2,
      index: 2,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 3,
      index: 3,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 4,
      index: 4,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 5,
      index: 5,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 6,
      index: 6,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 7,
      index: 7,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 8,
      index: 8,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 9,
      index: 9,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 10,
      index: 10,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 11,
      index: 11,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 12,
      index: 12,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
    {
      id: 13,
      index: 13,
      name: '低压铜芯电缆',
      spec: 'YJV22 26/35KV 3×120',
      unit: '厘米',
      price: '12345678.12',
      number: '12345678',
      money: '4500000',
      remarks: '备注信息备注信息备注信息.....',
      isActive: false,
    },
  ]);
  // 详情
  const dialogInfoVisible = ref<boolean>(false);

  // 调整价格
  const dialogTableVisible = ref<boolean>(false);
  const adjustPriceFrom = ref<any>({
    number1: '',
    type1: 1,
    number2: '',
    type2: 1,
    number3: '',
    type3: 1,
  });

  // 添加报价单详情
  const drawerAddPrise = ref<any>(false);
  const listKeyword = ref<any>(null);

  const shippingCost = ref<any>(true);
  const isActive = ref<any>(true);

  // 报价单列表
  const drawerPriseList = ref<any>(false);
  function resetPriceById() {
    console.log('reset');
  }
  function showDetailDrawer(id: any) {
    drawerPriseDetail.value = true;
    priseDetailId.value = id;
    console.log(drawerPriseDetail.value, priseDetailId.value);
  }
  // 报价单详情
  const drawerPriseDetail = ref<any>(false);
  const priseDetailId = ref<any>(null);
</script>

<style scoped lang="less">
  .left-navbar {
    flex: 0 0 260px;
    max-width: 260px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(128, 128, 128, 0.2);
    border-radius: 0px 0px 0px 0px;
    .top-navbar-self {
      position: relative;
      margin: 11px;
      width: 238px;
      height: 38px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #cccccc;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      .level-box {
        max-height: 668px;
        padding: 6px;
        position: absolute;
        right: -220px;
        top: 0;
        background: #cccccc;
        width: 200px;
        height: 668px;
        background: #ffffff;
        box-shadow:
          0px 5px 5px -3px rgba(0, 0, 0, 0.1),
          0px 8px 10px 1px rgba(0, 0, 0, 0.06),
          0px 3px 14px 2px rgba(0, 0, 0, 0.05);
        border-radius: 6px 6px 6px 6px;
        border: 1px solid #dcdcdc;
        z-index: 999;
        .level-one {
          height: 45px;
          line-height: 45px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          border-radius: 3px 3px 3px 3px;
          cursor: pointer;
          &.active {
            background: #f2f5ff;
          }
        }
      }
    }
    .text {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
  }
  .popup-box-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    top: 0;
    left: 0;
  }
  .search {
    position: relative;
    margin: 8px 0 22px;
    :deep(.el-icon) {
      font-size: 18px;
    }
  }
  .search-table {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    max-height: 463px;
    overflow: hidden;
    background: #ffffff;
    box-shadow:
      0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.08),
      0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px 6px 6px 6px;
    z-index: 991;
    .table-head {
      width: 100%;
      height: 37px;
      background: #f3f3f3;
      border-radius: 6px 6px 0px 0px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 12px;
      color: #333333;
      cursor: default;
      .xian {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 14px;
          width: 1px;
          background-color: #999;
        }
      }
    }
    .table-body {
      max-height: 426px;
      overflow: hidden;
      .table-tr {
        height: 28px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        cursor: pointer;
        color: #333333;
        &:hover {
          color: #0066ff;
          background: #f2f5ff;
        }
      }
    }
    .f-48 {
      flex: 0 0 48%;
    }
    .f-26 {
      flex: 0 0 26%;
    }
  }
  .custom-tree-node {
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      flex: 0 0 200px;
      text-wrap: wrap;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
    .level1 {
      font-size: 16px;
    }
  }
  :deep(.el-tree-node__content) {
    padding-left: 26px !important;
    height: 45px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
  }
  :deep(.el-tree-node__expand-icon),
  :deep(.el-tree-node__leaf-icon) {
    display: none !important;
  }
  .huishou {
    display: none;
  }
  .xiala {
    display: block;
  }
  :deep(.is-expanded) {
    .huishou {
      display: block;
    }
    .xiala {
      display: none;
    }
  }
  :deep(.el-tree-node:focus > .el-tree-node__content) {
    background: rgba(0, 0, 0, 0);
  }
  :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background: rgba(0, 0, 0, 0);
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    .el-tree-node__label {
      font-size: 16px;
      color: #333333;
    }
  }
  :deep(.el-tree--highlight-current .el-tree-node__children .el-tree-node.is-current > .el-tree-node__content) {
    background: #f4f9ff;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    border-right: 2px solid #0066ff;
    .el-tree-node__label {
      font-size: 14px;
      color: #0066ff;
    }
  }
  .right-content {
    padding: 20px;
    flex: 0 0 calc(100% - 260px);
    max-width: calc(100% - 260px);
    .list {
      padding: 16px;
      flex: 0 0 calc(42% - 10px);
      max-width: calc(42% - 10px);
      // min-width: 680px;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
      border-radius: 8px 8px 8px 8px;
    }
    .add-content {
      flex: 0 0 58%;
      max-width: 58%;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
      border-radius: 8px 8px 8px 8px;
      .head-title {
        height: 60px;
        background: #ffffff;
        box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
        border-radius: 8px 8px 0px 0px;
        .left-title {
          position: relative;
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #333333;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -20px;
            width: 100%;
            height: 3px;
            background: linear-gradient(130deg, #3796ff 0%, #005eff 100%);
            border-radius: 4px 4px 4px 4px;
          }
        }
      }
    }
  }
  .foot {
    height: 60px;
    background: rgba(233, 239, 255, 0.5);
    border-radius: 0px 0px 8px 8px;
    border: 1px solid #dfe7ff;
    .foot-text {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #183eac;
    }
    .foot-price {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #ff0003;
      span {
        font-size: 14px;
      }
    }
    .foot-btn {
      width: 155px;
      height: 60px;
      line-height: 60px;
      background: linear-gradient(170deg, #5f8fff 0%, #2d6cff 100%);
      border-radius: 0px 0px 8px 0px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 18px;
      color: #ffffff;
      text-align: center;
    }
    .foot-btn2 {
      height: 40px;
      background: #4594fb;
      border-radius: 4px 4px 4px 4px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      line-height: 40px;
      text-align: center;
    }
  }
  .add-btns {
    padding: 0 10px;
    height: 30px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ececec;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .select-box {
    .select-gg {
      width: 210px;
      height: 32px;
      background: #ffffff;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #cccccc;

      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 16px;
      span {
        max-width: 160px;
      }
    }
    .select-btn {
      padding: 0 14px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ececec;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 12px;
      span,
      img {
        vertical-align: middle;
      }
      .num {
        color: #2d6cff;
      }
    }
  }

  :deep(.search .el-input__wrapper) {
    padding-left: 0;
    height: 34px;
    border-bottom: 1px solid #cccccc;
    box-shadow: none !important;
    border-radius: 0;
  }
  .table-input {
    :deep(.el-input__wrapper) {
      width: 80px;
      height: 32px;
      background: #ffffff;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #dcdcdc;
      box-shadow: none;
    }
    :deep(.el-input__inner) {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
      text-align: center;
    }
  }
  .table-name {
    line-height: 22px;
  }
  :deep(.el-table-column--selection) {
    text-align: center;
  }
  :deep(.el-checkbox__input .el-checkbox__inner) {
    width: 18px;
    height: 18px;
    content: '';
    border: 0;
    size: 0;
    background-color: transparent;
    background: url('@/assets/images/price/Vector.png');
    background-size: 18px 18px;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
    display: none;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: url('@/assets/images/price/Vector1.png');
    background-size: 18px 18px;
  }

  .dialog-self {
    position: relative;
    padding: 0;
    border-radius: 12px 12px 12px 12px;
    background: #ffffff;
    box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
    background: linear-gradient(180deg, #e7f0fc 0%, #fff 56px, #fff 56px);
    .dialog-title {
      line-height: 44px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 22px;
      color: #0a1629;
      text-align: center;
      cursor: default;
    }

    .close {
      position: absolute;
      top: 27px;
      right: 23px;
      cursor: pointer;
    }

    .text1 {
      width: 54px;
      height: 30px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 30px;
      cursor: default;
    }
    .operator-box {
      padding: 2px;
      width: 54px;
      height: 30px;
      background: #eff2ff;
      border-radius: 6px 6px 6px 6px;
      cursor: pointer;
    }
    .adjust-input {
      width: 160px;
      height: 32px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #e9e9e9;
      box-shadow: none;
    }
    .dialog-btn {
      width: 120px;
      height: 42px;
      line-height: 42px;
      background: #f2f3f5;
      border-radius: 4px 4px 4px 4px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #717579;
      text-align: center;
      cursor: pointer;
    }
    .confirm-btn {
      color: #ffffff;
      background: #197cfa;
    }
  }
  .drawer-content {
    position: relative;
    border-radius: 12px 12px 12px 12px;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
    background: linear-gradient(180deg, #e7f0fc 0%, #fff 56px, #fff 56px);
    .close {
      position: absolute;
      top: 24px;
      right: 20px;
      cursor: pointer;
    }
    .drawer-title {
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 22px;
      color: #162445;
      line-height: 21px;
      text-align: center;
    }
    .card-label {
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #1a202c;
      line-height: 20px;
    }
    .label {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 32px;
    }
    .value {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 32px;
    }
    :deep(.search-box .el-input) {
      width: 500px;
      height: 32px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #e9e9e9 !important;
    }
    .table-bottom {
      height: 50px;
      background: #f4f5f7;
      border-radius: 0px 0px 0px 0px;
      .label1 {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
      .label2 {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
      }
      .value2 {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 16px;
        color: #ff0003;
      }
    }
    .export-btn {
      min-width: 120px;
      height: 40px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #ececec;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      text-align: center;
      cursor: pointer;
    }
  }
  .dialog-self2 {
    .dialog-title2 {
      line-height: 30px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 22px;
      color: #0a1629;
      text-align: center;
      cursor: default;
    }
    .close2 {
      position: absolute;
      top: 14px;
      right: 26px;
      cursor: pointer;
    }
    .right-btn,
    .left-btn {
      width: 19px;
      height: 43px;
      background: #eaeaea;
      border-radius: 0px 6px 6px 0px;
    }
    .left-btn {
      border-radius: 6px 0px 0px 6px;
    }
    .big-img {
      width: 486px;
      height: 258px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .img-item {
      width: 81px;
      height: 43px;
    }
    .info {
      width: 530px;
      .info-title {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #000000;
        line-height: 30px;
        cursor: default;
        span {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #2d6cff;
          vertical-align: middle;
        }
      }
      .cate {
        height: 22px;
        line-height: 22px;
        .cate-item {
          margin-right: 45px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #666666;
          text-align: center;
          font-style: normal;
          text-transform: none;
          &.active {
            position: relative;
            color: #2d6cff;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              bottom: -7px;
              left: 0;
              height: 2px;
              background: #2d6cff;
              border-radius: 4px 4px 4px 4px;
            }
          }
        }
      }
      .price-box {
        width: 100%;
        height: 56px;
        background: #f8f8f8;
        border-radius: 0px 0px 0px 0px;
        border-top: 1px solid #ececec;
        border-bottom: 1px solid #ececec;
        div {
          flex: 0 0 33%;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #666666;
          line-height: 14px;
          span:last-of-type {
            color: #121212;
          }
        }
      }
      .info-unit {
        div {
          line-height: 40px;
          position: relative;
          flex: 0 0 50%;
          &:nth-child(2n - 1):after {
            content: '';
            position: absolute;
            right: 8px;
            top: 0;
            width: 1px;
            height: 42px;
            background: #ececec;
          }
        }
        span {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }
        .label {
          padding-left: 20px;
        }
        .value {
          padding-left: 6px;
          color: #121212;
        }
      }
      .dialog-num {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        .el-input {
          width: 65px;
          height: 30px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #d4d6d9;
          .el-input__wrapper {
            padding: 0 8px;
            box-shadow: none;
          }
        }
      }
      .add-btn {
        width: 100px;
        height: 32px;
        line-height: 32px;
        background: linear-gradient(360deg, #ff4d00 0%, #ff7c44 100%);
        border-radius: 4px 4px 4px 4px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
      }
    }
    .tab-card {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #666666;
      line-height: 28px;
      cursor: pointer;
      .active {
        font-weight: bold;
        color: #121212;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          bottom: -7px;
          left: 0;
          height: 3px;
          background: linear-gradient(177deg, #5398ff 0%, #3563e9 100%);
          border-radius: 3px 3px 3px 3px;
        }
      }
    }
    .card-list {
      cursor: default;
      .label {
        flex: 0 0 100px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        line-height: 20px;
      }
      .value {
        flex: 0 0 calc(100% - 100px);
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }
      .files {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #197cfa;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
  :deep(.table-center.el-table .cell) {
    text-align: center;
  }
  :deep(.el-table .cell) {
    padding: 0 8px;
  }
  :deep(.el-table .center-cell .cell) {
    padding: 0 8px;
  }
  :deep(.adjust-input .el-input__wrapper) {
    border: 0;
    box-shadow: none;
  }
  :deep(.el-radio) {
    margin-right: 16px;
  }
  :deep(.el-radio__inner) {
    width: 16px;
    height: 16px;
    border-color: #dcdcdc;
  }
  :deep(.el-radio__label),
  :deep(.el-radio__input.is-checked + .el-radio__label) {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 22px;
  }
  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #fff;
    border-color: #0052d9;
  }
  :deep(.el-radio__inner:after) {
    width: 8px;
    height: 8px;
    background: #0052d9;
  }
  :deep(.el-radio__inner:hover) {
    border-color: #dcdcdc;
  }
</style>
<style>
  .select-type {
    width: 210px;
    height: 32px;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    line-height: 22px;
    &.active {
      background: #f2f5ff !important;
    }
  }
  .el-dialog {
    height: 80%;
    padding: 0;
    border-radius: 12px 12px 12px 12px;
    background: #ffffff;
    box-shadow: 0px 6px 58px 0px rgba(121, 145, 173, 0.2);
    background: linear-gradient(180deg, #e7f0fc 0%, #fff 56px, #fff 56px);
  }
  .el-dialog.dialog-self {
    height: 349px;
  }
  .el-dialog__body {
    height: 100%;
    overflow: hidden;
  }
  .el-dialog__header {
    padding: 0;
    height: 0;
  }
  .el-dropdown:focus-visible,
  img:focus-visible {
    outline: none;
  }
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background: #f2f5ff;
    color: #333;
  }
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #fff;
    color: #333;
  }
  .el-breadcrumb {
    margin: 15px 0 14px;
    height: 22px;
    .el-breadcrumb__inner,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      line-height: 22px;
      cursor: default;
    }
  }
  .el-table {
    border-radius: 8px;
    border: 1px solid #ececec;
    thead {
      tr .el-table__cell {
        height: 52px;
        background: #f4f5f7;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #31373d;
        text-align: center;
      }
    }
    tbody tr {
      width: 644px;
      height: 50px;
      border: 1px solid #ececec;
      .el-table__cell {
        background: #ffffff;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #31373d;
        line-height: 14px;
      }
    }
  }
  .no-radius {
    border-radius: 0px;
    border-bottom: 0;
  }
  .table-btn {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #2d6cff;
    cursor: pointer;
  }
  .active-row {
    background: rgba(233, 239, 255, 0.6);
    border: 1px solid #ececec;
  }
  .table-input input::placeholder {
    font-size: 12px !important;
    color: #333333 !important;
  }
  .el-drawer__body {
    padding: 0 !important;
  }
  .el-input__wrapper,
  .el-input__wrapper:hover,
  .el-input__wrapper.is-focus {
    box-shadow: none;
  }
  .el-pagination.is-background .btn-next.is-active,
  .el-pagination.is-background .btn-prev.is-active,
  .el-pagination.is-background .el-pager li.is-active {
    background-color: #3563e9;
  }
  .el-pager li.is-active,
  .el-pager li:hover {
    color: #3563e9;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #f5f6f7;
    width: 9px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #bbbdbf;
  }
  .no-icon .el-input__prefix-inner {
    display: none;
  }
  .self-hover-table .el-input__wrapper {
    border: none !important;
  }
  .self-hover-table .el-table__row:hover .el-input__wrapper,
  .self-hover-table .current-row .el-input__wrapper {
    border: 1px solid #dcdcdc !important;
  }
</style>
