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
              <img class="xiala w-12px h-7px" :src="$getAssetsImages('price/icon1.png')" alt="" />
              <img class="huishou w-12px h-7px" :src="$getAssetsImages('price/icon2.png')" alt="" />
            </div>
          </div> </template
      ></el-tree>
    </div>
  </div>
  <div class="right-content flex">
    <div class="list mr-10">
      <div class="search">
        <el-input
          placeholder="请输入关键词"
          v-model="keyword"
          clearable
          @focus="showSearchTable = true"
          style="position: relative; z-index: 88"
          @input="changeSearch"
        >
          <template #prefix>
            <img :src="$getAssetsImages('price/icon5.png')" alt="" class="w-14px h-14px" />
          </template>
        </el-input>
        <div class="search-table" v-if="showSearchTable && keyword" style="top: 40px; left: 0">
          <div class="table-head flex-center" v-if="searchList.length != 0">
            <div class="f-48 pl-30">产品名称</div>
            <div class="xian f-26 pl-8">型号</div>
            <div class="xian f-26 pl-8" v-if="isHasSpec">规格</div>
          </div>
          <div class="table-body scroll-none">
            <div class="table-tr flex-center" v-if="searchList.length == 0">
              <div>无相关数据</div>
            </div>
            <div v-for="item of searchList" :key="item" class="table-tr flex-center" @click="changeSelect(item)">
              <div class="f-48 pl-30">{{ item.name }}</div>
              <div class="f-26 pl-8">{{ item.type_name }}</div>
              <div class="f-26 pl-8" v-if="isHasSpec">{{ item.spec_name }}</div>
            </div>
          </div>
        </div>
        <div class="popup-box-bg z-66" v-if="showSearchTable" @click="closeSearchTable"> </div>
      </div>
      <div class="select-box flex-between">
        <el-dropdown trigger="click">
          <div class="select-gg flex-between px-14 cursor-pointer el-dropdown-link">
            <span class="text-over-1">{{ activeLabelIdLabel }}</span>

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
          <img :src="$getAssetsImages('price/icon4.png')" alt="" />
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
        ref="tableRef"
        :data="SeriesSpecList"
        row-key="spec_id"
        :current-row="11146"
        current-row-key="spec_id"
        style="width: 100%"
        height="calc(100% - 146px)"
        class="self-hover-table"
        table-layout="fixed"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @row-dblclick="showInfoDetail"
      >
        <!-- @current-change="handleCurrentChange" -->
        <el-table-column type="selection" width="60" :reserve-selection="true" />
        <el-table-column label="产品名称">
          <template #default="scope">
            <div class="table-name">{{ scope.row.spec_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price" width="90">
          <template #default="scope">
            <div class="flex-center"
              ><el-input
                v-if="scope.row.price_modification == 1"
                class="table-input quantity-input"
                v-model="scope.row.spec_price"
                style="width: 80px"
                placeholder="1"
                type="number"
                @dblclick.stop=""
                @change="changeSpecPrice(scope.row)"
              />
              <div v-else>{{ scope.row.spec_price }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantity" width="90">
          <template #default="scope">
            <div class="flex-center">
              <el-input
                class="table-input quantity-input"
                @dblclick.stop=""
                v-model="scope.row.quantity"
                type="number"
                style="width: 80px"
                placeholder="1"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div class="table-btn flex-center">
              <div @click="handleCopy(scope.row.copy_name)" class="flex-center">
                <img :src="$getAssetsImages('price/icon-copy.png')" alt="" class="w-17px h-16px" />
              </div>
              <div class="ml-12" @click="appendItemToPrice(scope.row)">加入报价单</div>
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
        <el-radio-group v-model="quotationType" @change="changePriceType">
          <el-radio :value="0">单价</el-radio>
          <el-radio :value="1">专票</el-radio>
          <el-radio :value="2">普票</el-radio>
        </el-radio-group>

        <div class="flex">
          <div class="add-btns ml-10" @click="changeColor('isRedText')" :style="isRedText ? 'opacity:1' : 'opacity:.5'">
            <img :src="$getAssetsImages('price/icon-red.png')" alt="" />
          </div>
          <div class="add-btns ml-10" @click="changeColor('isBlueText')" :style="isBlueText ? 'opacity:1' : 'opacity:.5'">
            <img :src="$getAssetsImages('price/icon-blue.png')" alt="" />
          </div>
          <div class="add-btns ml-10" @click="changeColor('isBlackText')" :style="isBlackText ? 'opacity:1' : 'opacity:.5'">
            <img :src="$getAssetsImages('price/icon-black.png')" alt="" />
          </div>
          <div class="add-btns ml-10" @click="appendNewItemToPrice(null)" v-loading="isLoading">
            <img :src="$getAssetsImages('price/icon-add.png')" alt="" class="mr-4" />
            <span>新增数据</span>
          </div>
          <div class="add-btns ml-10" @click="showAdjustPrice">
            <img :src="$getAssetsImages('price/icon-jgtz.png')" alt="" class="mr-4" />
            <span>价格调整</span>
          </div>
          <div class="add-btns ml-10" @click="clearDialog = true">
            <img :src="$getAssetsImages('price/icon-qingkong.png')" alt="" class="mr-4" />
            <span>清空报价单</span>
          </div>
          <div class="add-btns ml-10" @click="delQuotationItem(null)">
            <img :src="$getAssetsImages('price/icon-qingkong.png')" alt="" class="mr-4" />
            <span>删除</span>
          </div>
        </div>
      </div>
      <div style="height: calc(100% - 198px)">
        <div
          class="search-input"
          :style="{
            ...offsetStyle,
            transform: isBottom ? 'translateY(' + (tableSearchList.length > 6 ? -242 : tableSearchList.length * -28 - 62) + 'px)' : '',
          }"
          v-if="showTableSearchTable && searchKeyword"
        >
          <div class="search-table" style="top: 0; left: 0">
            <div class="table-head flex-center" v-if="tableSearchList.length != 0">
              <div class="f-48 pl-30">产品名称</div>
              <div class="f-48 xian pl-8" v-if="isTableHasSpec">型号规格</div>
            </div>
            <div class="table-body scroll-none">
              <div class="table-tr flex-center" v-if="tableSearchList.length == 0">
                <div>无相关数据</div>
              </div>
              <div v-for="item of tableSearchList" :key="item" class="table-tr flex-center" @click="changeTableSelect(item)">
                <div class="f-48 pl-30">{{ item.name }}</div>
                <div class="f-48 pl-8" v-if="isTableHasSpec">{{ item.spec_name }}</div>
              </div>
            </div>
          </div>
          <div class="popup-box-bg z-66" v-if="showTableSearchTable" @click="closeTableSearchTable"> </div>
        </div>
        <el-table
          ref="quotationTableRef"
          row-key="id"
          :data="quotationTableData"
          class="no-radius"
          style="width: 100%"
          height="100%"
          class-name="self-hover-table"
          table-layout="fixed"
          highlight-current-row
          @selection-change="SelectionQuotationChange"
          empty-text="请添加产品"
          @click="handleQuotationClick"
        >
          <!-- <el-table-column label="" width="54" cell-class-name="center-cell">
            <template #default="scope">
              <div class="flex-center">
                <img
                  :src="$getAssetsImages('price/icon-del-one.png')"
                  alt=""
                  class="cursor-pointer w-18px h-18px"
                  @click="delQuotationItem(scope.row.id)"
                />
                <img
                  :src="$getAssetsImages('price/icon-add-one.png')"
                  alt=""
                  class="cursor-pointer ml-4 w-18px h-18px"
                  @click="appendNewItemToPrice(scope.row.id)"
                />
              </div>
            </template>
          </el-table-column> -->
          <el-table-column type="selection" width="30" />
          <el-table-column label="序号" width="60">
            <template #default="scope">
              <div class="table-index">
                <div class="flex-center"> {{ scope.row.index }} </div>
              </div>
              <div class="table-btns">
                <div class="flex-center">
                  <img
                    :src="$getAssetsImages('price/icon-del-one.png')"
                    alt=""
                    class="cursor-pointer w-18px h-18px"
                    @click="delQuotationItem(scope.row.id)"
                  />
                  <img
                    :src="$getAssetsImages('price/icon-add-one.png')"
                    alt=""
                    class="cursor-pointer ml-4 w-18px h-18px"
                    @click="appendNewItemToPrice(scope.row.id)"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="name" min-width="180">
            <template #default="scope">
              <el-input
                class="table-input"
                v-model="scope.row.name.content"
                placeholder=""
                @focus="setColor(scope.row, 'name')"
                :class="scope.row.name.color"
                v-if="scope.row.searchable"
              />
              <el-input
                class="table-input"
                v-model="scope.row.name.content"
                placeholder=""
                style="position: relative; z-index: 88"
                @focus="(e: any) => setColorAndShowTable(e, scope.row, 'name')"
                :class="scope.row.name.color"
                @input="changeTableSearch"
                @change="(e) => changeTableValue(e, scope.row, 'name')"
                v-else
              />
            </template>
          </el-table-column>
          <el-table-column label="型号规格" prop="spec_name" min-width="180">
            <template #default="scope">
              <div class="flex-center" v-if="scope.row.spec_name">
                <el-input
                  class="table-input"
                  v-model="scope.row.spec_name.content"
                  @focus="setColor(scope.row, 'spec_name')"
                  @change="(e) => changeTableValue(e, scope.row, 'spec_name')"
                  placeholder=""
                  :class="scope.row.spec_name.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" width="90">
            <template #default="scope">
              <div class="flex-center" v-if="scope.row.spec_unit">
                <el-input
                  class="table-input"
                  v-model="scope.row.spec_unit.content"
                  style="width: 80px"
                  @focus="setColor(scope.row, 'spec_unit')"
                  @change="(e) => changeTableValue(e, scope.row, 'spec_unit')"
                  placeholder=""
                  :class="scope.row.spec_unit.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="90">
            <template #default="scope">
              <div class="flex-center" v-if="scope.row.quantity">
                <el-input
                  class="table-input quantity-input"
                  type="number"
                  v-model="scope.row.quantity.content"
                  style="width: 80px"
                  @focus="setColor(scope.row, 'quantity')"
                  @change="(e) => changeTableValue(e, scope.row, 'quantity')"
                  placeholder=""
                  :class="scope.row.quantity.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="90" v-if="quotationType == 0">
            <template #default="scope">
              <!-- <div class="flex-center" :style="{ color: scope.row.spec_price.color }" v-if="scope.row.spec_price">
                {{ scope.row.spec_price.content }}
              </div> -->
              <div class="flex-center" v-if="scope.row.spec_price">
                <el-input
                  class="table-input quantity-input"
                  type="number"
                  v-model="scope.row.spec_price.content"
                  @focus="setColor(scope.row, 'spec_price')"
                  @change="(e) => changeTableValue(e, scope.row, 'spec_price')"
                  :class="scope.row.spec_price.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="专票价格" width="90" v-if="quotationType == 1">
            <template #default="scope">
              <!-- <div class="flex-center" :style="{ color: scope.row.spec_price_tax.color }" v-if="scope.row.spec_price_tax">
                {{ scope.row.spec_price_tax.content }}
              </div>-->
              <div class="flex-center" v-if="scope.row.spec_price_tax">
                <el-input
                  type="number"
                  class="table-input quantity-input"
                  v-model="scope.row.spec_price_tax.content"
                  @focus="setColor(scope.row, 'spec_price_tax')"
                  @change="(e) => changeTableValue(e, scope.row, 'spec_price_tax')"
                  :class="scope.row.spec_price_tax.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="普票价格" width="90" v-if="quotationType == 2">
            <template #default="scope">
              <!-- <div class="flex-center" :style="{ color: scope.row.spec_price_tax_ordinary.color }" v-if="scope.row.spec_price_tax_ordinary">
                {{ scope.row.spec_price_tax_ordinary.content }}
              </div>-->
              <div class="flex-center" v-if="scope.row.spec_price_tax_ordinary">
                <el-input
                  type="number"
                  class="table-input quantity-input"
                  v-model="scope.row.spec_price_tax_ordinary.content"
                  @focus="setColor(scope.row, 'spec_price_tax_ordinary')"
                  @change="(e) => changeTableValue(e, scope.row, 'spec_price_tax_ordinary')"
                  :class="scope.row.spec_price_tax_ordinary.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="90">
            <template #default="scope">
              <div class="flex-center" :style="{ color: scope.row.amount.color }" v-if="scope.row.amount">
                {{ scope.row.amount.content }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注信息" min-width="150">
            <template #default="scope">
              <div class="flex-center" v-if="scope.row.spec_remark">
                <el-input
                  class="table-input"
                  v-model="scope.row.spec_remark.content"
                  @focus="setColor(scope.row, 'spec_remark')"
                  @change="(e) => changeTableValue(e, scope.row, 'spec_remark')"
                  :class="scope.row.spec_remark.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="重量">
            <template #default="scope">
              <div class="flex-center" v-if="scope.row.reference_weight && scope.row.searchable">
                {{ scope.row.reference_weight.content }}
                <!-- <el-input
                  class="table-input"
                  v-model="scope.row.reference_weight.content"
                  placeholder="1"
                  :style="{ color: scope.row.reference_weight.color }"
                /> -->
              </div>
              <div class="flex-center" v-else-if="scope.row.reference_weight">
                <el-input
                  class="table-input"
                  v-model="scope.row.reference_weight.content"
                  @focus="setColor(scope.row, 'reference_weight')"
                  @change="(e) => changeTableValue(e, scope.row, 'reference_weight')"
                  :class="scope.row.reference_weight.color"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总重量">
            <template #default="scope">
              <div class="flex-center">
                {{ scope.row.reference_weight_total.content }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot flex-between">
        <div class="flex-between cursor-default">
          <div class="foot-text ml-40">参考重量：{{ quotationInfo.reference_weight_total }}</div>
          <div class="foot-text ml-40">合计总价：</div>
          <div class="foot-price" v-if="quotationInfo.is_unit_price == 1"><span>￥</span>{{ quotationInfo.generation_amount }}</div>
          <div class="foot-price" v-if="quotationInfo.is_special_ticket == 1"><span>￥</span>{{ quotationInfo.generation_tax_amount }}</div>
          <div class="foot-price" v-if="quotationInfo.is_special_invoice == 1"><span>￥</span>{{ quotationInfo.generation_tax_ordinary_amount }}</div>
        </div>
        <div class="foot-btn cursor-pointer" @click="showCreatePrice">生成报价单</div>
      </div>
    </div>
  </div>
  <el-dialog v-model="adjustPriceDialog" width="375" class="dialog-self" :show-close="false" align-center>
    <img :src="$getAssetsImages('price/icon-close.png')" alt="" class="close" @click="adjustPriceDialog = false" />
    <div class="dialog-title pt-27 pb-26">价格调整</div>
    <div class="px-46 mb-40">
      <div class="flex mb-20">
        <div class="text1">调价1：</div>
        <div class="flex-between operator-box mx-8">
          <img v-if="adjustPriceFrom.type1 == 2" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type1 = 2" />
          <img v-if="adjustPriceFrom.type1 == 1" :src="$getAssetsImages('price/chu-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type1 = 1" />
        </div>
        <el-input v-model="adjustPriceFrom.number1" class="adjust-input" placeholder="请输入调价系数"> </el-input>
      </div>
      <div class="flex mb-20">
        <div class="text1">调价2：</div>
        <div class="flex-between operator-box mx-8">
          <img v-if="adjustPriceFrom.type2 == 2" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type2 = 2" />
          <img v-if="adjustPriceFrom.type2 == 1" :src="$getAssetsImages('price/chu-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type2 = 1" />
        </div>
        <el-input v-model="adjustPriceFrom.number2" class="adjust-input" placeholder="请输入调价系数"> </el-input>
      </div>
      <div class="flex mb-20">
        <div class="text1">调价3：</div>
        <div class="flex-between operator-box mx-8">
          <img v-if="adjustPriceFrom.type3 == 2" :src="$getAssetsImages('price/cheng-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/cheng-normal.png')" alt="" @click="adjustPriceFrom.type3 = 2" />
          <img v-if="adjustPriceFrom.type3 == 1" :src="$getAssetsImages('price/chu-select.png')" alt="" />
          <img v-else :src="$getAssetsImages('price/chu-normal.png')" alt="" @click="adjustPriceFrom.type3 = 1" />
        </div>
        <el-input v-model="adjustPriceFrom.number3" class="adjust-input" placeholder="请输入调价系数"> </el-input>
      </div>
      <div class="flex">
        <div class="text1">小数位：</div>
        <div class="flex-between operator-box mx-8" style="width: 88px">
          <div class="num-box mr-2" :class="{ active: adjustPriceFrom.decimal_places == 0 }" @click="adjustPriceFrom.decimal_places = 0"> 0 </div>
          <div class="num-box mr-2" :class="{ active: adjustPriceFrom.decimal_places == 1 }" @click="adjustPriceFrom.decimal_places = 1"> 1 </div>
          <div class="num-box mr-2" :class="{ active: adjustPriceFrom.decimal_places == 2 }" @click="adjustPriceFrom.decimal_places = 2"> 2 </div>
        </div>
      </div>
    </div>
    <div class="flex-center">
      <div class="dialog-btn mr-20" @click="adjustPriceDialog = true">取消</div>
      <div class="dialog-btn confirm-btn" @click="adjustPrice">确定</div>
    </div>
  </el-dialog>
  <el-dialog v-model="updateDialog" width="375" class="dialog-self dialog-self4" :show-close="false" align-center>
    <img :src="$getAssetsImages('price/icon-close.png')" alt="" class="close" @click="updateDialog = false" />
    <div class="dialog-title pt-27 pb-26">更新提示</div>
    <div class="px-46 mb-40 flex-center">
      <div class="tip" style="font-size: 16px">是否更新报价</div>
    </div>
    <div class="flex-center">
      <div class="dialog-btn mr-20" @click="updatePrice(0)">取消</div>
      <div class="dialog-btn confirm-btn" @click="updatePrice(1)">确定</div>
    </div>
  </el-dialog>
  <el-dialog v-model="clearDialog" width="375" class="dialog-self dialog-self4" :show-close="false" align-center>
    <img :src="$getAssetsImages('price/icon-close.png')" alt="" class="close" @click="clearDialog = false" />
    <div class="dialog-title pt-27 pb-26">清空提示</div>
    <div class="px-46 mb-40 flex-center">
      <div class="tip" style="font-size: 16px">是否清空报价</div>
    </div>
    <div class="flex-center">
      <div class="dialog-btn mr-20" @click="clearDialog = false">取消</div>
      <div class="dialog-btn confirm-btn" @click="clearQuotation([])">确定</div>
    </div>
  </el-dialog>
  <el-drawer v-model="drawerAddPrise" class="no-radius" direction="rtl" :with-header="false" size="1280">
    <template #default>
      <div class="drawer-content border-none">
        <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="drawerAddPrise = false" />
        <div class="drawer-title pt-24 pb-28">
          <img :src="$getAssetsImages('price/icon-title1.png')" alt="" class="mr-10" />
          <span>报价单详情页</span>
        </div>
        <div class="px-40 pb-64 scroll-none" style="height: calc(100% - 136px)">
          <div class="mb-20 flex search-box">
            <div class="label">报价日期：</div>
            <el-date-picker
              v-model="quotationInfo.generation_date"
              class="no-icon"
              type="datetime"
              placeholder="请选择"
              :default-time="new Date()"
              style="width: 220px"
              format="YYYY/MM/DD hh:mm"
              value-format="YYYY-MM-DD hh:mm"
              @change="changeValue('generation_date')"
              disabled
            />

            <div class="label ml-24">订单编号： </div>
            <el-input style="width: 220px" :value="quotationInfo.generation_sn" disabled></el-input>
          </div>
          <div class="mb-14 flex search-box">
            <div class="label">项目名称：</div>
            <el-input v-model="quotationInfo.project_name" placeholder="请输入" style="width: 220px" @change="changeValue('project_name')">
            </el-input>
            <div class="label ml-24">客户名称：</div>
            <el-input v-model="quotationInfo.customer_name" placeholder="请输入" style="width: 220px" @change="changeValue('customer_name')">
            </el-input>
            <div class="label ml-24">报价人名称：</div>
            <el-input
              v-model="quotationInfo.generation_user_name"
              placeholder="请输入"
              style="width: 220px"
              @change="changeValue('generation_user_name')"
            >
            </el-input>
          </div>
          <div class="card-label mb-20">报价明细： </div>
          <div class="flex-between">
            <el-radio-group v-model="quotationType" @change="changePriceType" class="mb-20">
              <el-radio :value="0">单价</el-radio>
              <el-radio :value="1">专票</el-radio>
              <el-radio :value="2">普票</el-radio>
            </el-radio-group>

            <div class="card-tips mb-20 cursor-default">
              <el-icon><Rank /></el-icon>
              <span> 表格可进行拖拽排序</span>
            </div>
          </div>
          <el-table
            ref="quotationSortTableRef"
            row-key="spec_id"
            :data="quotationTableData"
            class="no-radius"
            style="width: 100%; border-radius: 0"
            height="402px"
            table-layout="fixed"
            highlight-current-row
          >
            <el-table-column label="序号" width="60">
              <template #default="scope">
                <div class="flex-center"> {{ scope.row.index }} </div>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="180">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.name.color">{{ scope.row.name.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="型号规格" min-width="180">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.spec_name.color">{{ scope.row.spec_name.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.spec_unit.color">{{ scope.row.spec_unit.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.quantity.color">{{ scope.row.quantity.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center" v-if="quotationType == 0" :class="scope.row.spec_price.color">{{ scope.row.spec_price.content }}</div>
                <div class="flex-center" v-if="quotationType == 1" :class="scope.row.spec_price_tax.color">{{
                  scope.row.spec_price_tax.content
                }}</div>
                <div class="flex-center" v-if="quotationType == 2" :class="scope.row.spec_price_tax_ordinary.color">{{
                  scope.row.spec_price_tax_ordinary.content
                }}</div>
              </template>
            </el-table-column>
            <el-table-column label="金额" prop="number" width="90">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.amount.color">{{ scope.row.amount.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="备注信息" prop="number">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.spec_remark.color">{{ scope.row.spec_remark.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="重量" prop="number">
              <template #default="scope">
                <div class="flex-center" :class="scope.row.reference_weight.color">{{ scope.row.reference_weight.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="总重量">
              <template #default="scope">
                <div class="flex-center">
                  {{ scope.row.reference_weight_total.content }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-18 flex">
            <div class="label">公司名称：</div>
            <div>
              <el-radio-group v-model="shopType" @change="changeShopType">
                <el-radio v-for="item in shopList" :key="item.id" :value="item.id"
                  ><img :src="item.logo" alt="" class="mr-6" style="width: 18px; height: 18px; border-radius: 2px" />
                  <span>{{ item.company_name }}</span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="mt-10 flex items-center">
            <div class="card-label">收货信息：</div>
            <div class="label">是否含运费：</div>
            <el-switch
              v-model="quotationInfo.shipping_cost"
              class="mx-14"
              style="--el-switch-on-color: #04b500"
              :active-value="1"
              :inactive-value="0"
              @change="changeValue('shipping_cost')"
            />
            <div style="font-size: 14px; color: #666666"> {{ quotationInfo.shipping_cost ? '是' : '否' }} </div>
          </div>
          <div class="mt-20 flex items-center search-box" v-if="quotationInfo.shipping_cost">
            <div class="label">收货地址：</div>
            <el-input v-model="quotationInfo.address" placeholder="请输入" style="width: 430px" @change="changeValue('address')"> </el-input>
          </div>
          <div class="mt-20 flex search-box">
            <div class="label">铜价铝价：</div>
            <div class="flex items-center">
              <el-switch
                v-model="quotationInfo.is_raw_price"
                class="mr-14"
                style="--el-switch-on-color: #04b500"
                :active-value="1"
                :inactive-value="0"
                @change="changeValue('is_raw_price')"
              />
              <div style="font-size: 14px; color: #666666"> {{ quotationInfo.is_raw_price ? '展示' : '隐藏' }} </div>
            </div>
          </div>
          <div class="mt-20 flex search-box" v-if="quotationInfo.is_raw_price">
            <div class="label">铜<span style="opacity: 0">铜价</span>价：</div>
            <el-input
              v-model="quotationInfo.generation_copper_price"
              placeholder="请输入"
              style="width: 430px"
              @change="changeValue('generation_copper_price')"
              class="quantity-input"
              type="number"
            >
            </el-input>
          </div>
          <div class="mt-20 flex search-box" v-if="quotationInfo.is_raw_price">
            <div class="label">铝<span style="opacity: 0">铝价</span>价：</div>
            <el-input
              v-model="quotationInfo.generation_aluminum_price"
              placeholder="请输入"
              style="width: 430px"
              @change="changeValue('generation_aluminum_price')"
              class="quantity-input"
              type="number"
            >
            </el-input>
          </div>
          <!-- <div class="mt-20 flex search-box">
            <div class="label">铝<span style="opacity: 0">铝价</span>价：</div>
            <div>
              <div class="flex items-center">
                <el-switch
                  v-model="quotationInfo.is_aluminum_price"
                  class="mr-14"
                  style="--el-switch-on-color: #04b500"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeValue('is_aluminum_price')"
                />
                <div style="font-size: 14px; color: #666666"> {{ quotationInfo.is_aluminum_price ? '是' : '否' }} </div>
              </div>
              <el-input
                v-if="quotationInfo.is_aluminum_price"
                v-model="quotationInfo.generation_aluminum_price"
                placeholder="请输入"
                style="width: 430px"
                @change="changeValue('generation_aluminum_price')"
                class="quantity-input"
                type="number"
              >
              </el-input>
            </div>
          </div> -->
          <div class="mt-20 flex search-box">
            <div class="label">备注信息：</div>
            <div class="flex-columns">
              <el-input
                v-model="listKeyword"
                v-for="(item, index) of remark_list"
                :key="index"
                placeholder="请输入"
                style="width: 430px"
                class="mb-10"
                :value="item.content"
                @change="(value) => changeRemarkValue(item, value)"
              >
                <template #prefix>
                  <div class="cursor-pointer">
                    <img :src="$getAssetsImages('price/Vector1.png')" alt="" v-if="item.is_selected" @click="changeMarker(item)" />
                    <img :src="$getAssetsImages('price/Vector.png')" alt="" v-else @click="changeMarker(item)" />
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="foot flex-between" style="border-radius: 0">
          <div class="flex-between cursor-default">
            <div class="foot-text ml-40">参考重量：{{ quotationInfo.reference_weight_total }}</div>
            <div class="foot-text ml-40">数量合计：{{ quotationInfo.total_quantity }}</div>
            <div class="foot-text ml-40">合计总价：</div>
            <div class="foot-price" v-if="quotationInfo.is_unit_price == 1"><span>￥</span>{{ quotationInfo.generation_amount }}</div>
            <div class="foot-price" v-if="quotationInfo.is_special_ticket == 1"><span>￥</span>{{ quotationInfo.generation_tax_amount }}</div>
            <div class="foot-price" v-if="quotationInfo.is_special_invoice == 1"
              ><span>￥</span>{{ quotationInfo.generation_tax_ordinary_amount }}</div
            >
          </div>
          <div class="px-16 foot-btn foot-btn2 cursor-pointer" @click="nowGenerateQuotation">立即生成</div>
        </div>
      </div>
    </template>
  </el-drawer>
  <InfoDetail
    v-if="dialogInfoVisible"
    v-model:dialogInfoVisible="dialogInfoVisible"
    @append-item-to-price="appendItemToPrice"
    @show-preview-pdf="showPreviewPdf"
    :infoDetailId="infoDetailId"
  />
  <priceList
    v-if="drawerPriseList"
    v-model:drawerPriseList="drawerPriseList"
    @show-detail-drawer="showDetailDrawer"
    @reset-price-by-id="resetPriceById"
  />
  <priceDetail
    v-if="drawerPriseDetail"
    v-model:drawerPriseDetail="drawerPriseDetail"
    :priseDetailId="priseDetailId"
    @reset-price-by-id="resetPriceById"
  />
  <previewPdf v-if="dialogPreviewPdf" v-model:dialogPreviewPdf="dialogPreviewPdf" :pdfFileUrl="pdfFileUrl" />
</template>

<script setup lang="ts">
  import Sortable from 'sortablejs';
  import _ from 'lodash';
  import { ElLoading } from 'element-plus';
  import {
    getSeriesList,
    getSeriesSonList,
    seriesSpecSearch,
    getSeriesSpecList,
    getlabellist,
    myInfo,
    addQuotation,
    editQuotation,
    seriesSpecNameSearch,
    clearSpec,
    priceAdjustment,
    colorAdjustment,
    getTemplateList,
    editRemark,
    specPriceEdit,
    generateQuotation,
    editSpec,
    quotationSpecSort,
  } from '@/api/price.ts';
  import { ArrowRight } from '@element-plus/icons-vue';
  import InfoDetail from './infoDetail.vue';
  import priceList from './priceList.vue';
  import priceDetail from './priceDetail.vue';
  import previewPdf from './previewPdf.vue';
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
  const activeLabelIdLabel = computed(() => {
    let label = '';
    labelList.value.forEach((item: any) => {
      if (item.id == activeLabelId.value) {
        label = item.title;
      }
    });
    return activeLabelId.value == '' ? '全部' : label;
  });
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
    }, 200);
  }
  const searchList = ref<any>([]);
  const isHasSpec = ref<any>(false);
  async function searchByKeyword(word: any) {
    let res = await seriesSpecSearch({
      search: word,
      page: 1,
      limit: 99999,
    });
    if (res.code == 200) {
      searchList.value = res.data;
      isHasSpec.value = res.data.filter((item: any) => item.spec_id != 0).length > 0;
    } else {
      searchList.value = [];
      isHasSpec.value = false;
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
    currentRowId.value = item.spec_id;
    getLabels(activeTypeId.value);
    getSeriesSonListCate(item.series_id, false);
  }

  // tableSearch
  const showTableSearchTable = ref<boolean>(false);
  function closeTableSearchTable() {
    showTableSearchTable.value = false;
    offsetStyle.value = null;
  }
  const timer2 = ref<any>(null);
  const searchKeyword = ref<any>(null);
  function changeTableSearch(e: any) {
    clearTimeout(timer2.value);
    timer2.value = setTimeout(() => {
      searchByTableKeyword(e);
      searchKeyword.value = e;
    }, 300);
  }
  const tableSearchList = ref<any>([]);
  const isTableHasSpec = ref<any>(false);
  async function searchByTableKeyword(word: any) {
    let res = await seriesSpecNameSearch({
      search: word,
      page: 1,
      limit: 99999,
    });
    if (res.code == 200) {
      tableSearchList.value = res.data;
      isTableHasSpec.value = res.data.filter((item: any) => item.spec_id != 0).length > 0;
    } else {
      tableSearchList.value = [];
      isTableHasSpec.value = false;
    }
  }
  const activeSearchId = ref<any>(null);
  async function changeTableSelect(data: any) {
    let res = await editSpec({
      quotation_id: quotationInfo.value.id,
      spec_list_id: activeSearchId.value,
      spec_id: data.spec_id,
      name: data.name,
      spec_name: data.spec_name,
      spec_unit: data.spec_unit,
      spec_price: data.spec_price,
      spec_price_tax: data.spec_price_tax,
      spec_price_tax_ordinary: data.spec_price_tax_ordinary,
      quantity: data.quantity,
      spec_remark: data.spec_remark,
      reference_weight: data.reference_weight,
    });
    if (res.code == 200) {
      quotationInfo.value.generation_amount = res.data.generation_amount;
      quotationInfo.value.generation_tax_amount = res.data.generation_tax_amount;
      quotationInfo.value.generation_tax_ordinary_amount = res.data.generation_tax_ordinary_amount;
      quotationInfo.value.reference_weight_total = res.data.reference_weight_total;
      quotationTableData.value = quotationTableData.value.map((tableItem: any, index: any) => {
        if (tableItem.id == activeSearchId.value) {
          tableItem = res.data.spec_item;
        }
        tableItem.index = index + 1;
        return tableItem;
      });

      activeSearchId.value = null;
      showTableSearchTable.value = false;
      tableSearchList.value = [];
    } else {
      $message.error(res.msg);
    }
  }
  const isBottom = ref<any>(null);
  const offsetStyle = ref<any>(null);
  const quotationTableRef = ref<any>(null);

  function setColorAndShowTable(e: any, item: any, key: any) {
    searchKeyword.value = null;
    const rect = e.target.getBoundingClientRect();
    let bodyHeight = document.documentElement.clientHeight;
    if (rect.bottom > bodyHeight / 2) {
      isBottom.value = true;
    } else {
      isBottom.value = false;
    }
    offsetStyle.value = { top: rect.bottom + 2 + 'px', left: rect.x - 12 + 'px', display: 'block' };
    quotationTableRef.value.setCurrentRow(item);
    setColor(item, key);
    activeSearchId.value = item.id;
    showTableSearchTable.value = true;
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
  const tableRef = ref<any>(null);
  const currentRowId = ref<any>(null);
  const SeriesSpecList = ref<any>([]);
  async function searchSeriesSpecList() {
    let res = await getSeriesSpecList({
      type_id: activeTypeId.value,
      label_id: activeLabelId.value,
    });
    if (res.code == 200) {
      SeriesSpecList.value = res.data.map((item: any) => {
        item.quantity = null;
        return item;
      });
      if (currentRowId.value) {
        let ind: any = null;
        const targetRow = SeriesSpecList.value.find((row: any, index: any) => {
          if (row.spec_id === currentRowId.value) {
            ind = index;
          }
          return row.spec_id === currentRowId.value;
        });
        if (targetRow) {
          tableRef.value.setCurrentRow(targetRow); // 设置 ID 为 3 的行为当前行
          currentRowId.value = null;
          nextTick(() => {
            setTimeout(() => {
              const tableBodyWrapper = tableRef.value.$el.querySelector('.el-scrollbar__wrap');
              const rows = tableBodyWrapper.querySelectorAll('.el-table__row');
              const targetRowElement = rows[ind]; // 获取目标行的 DOM 元素
              tableBodyWrapper.scrollTop = targetRowElement.offsetTop - tableBodyWrapper.offsetTop;
            }, 500);
          });
        }
      }
    } else {
      SeriesSpecList.value = [];
    }
  }
  const multipleSelection = ref<any>([]);
  function handleSelectionChange(val: any) {
    multipleSelection.value = val;
  }
  // 修改价格
  async function changeSpecPrice(item: any) {
    let res = await specPriceEdit({ spec_id: item.spec_id, spec_price: item.spec_price });
    if (res.code == 200) {
      $message({
        message: '修改成功',
        type: 'success',
      });
    } else {
      $message({
        message: res.msg,
        type: 'error',
      });
    }
  }
  // 复制
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
  // 添加到报价单
  async function appendItemToPrice(item: any) {
    addQuotationInfo(JSON.stringify([{ spec_id: item.spec_id, quantity: Number(item.quantity) || 1 }]), false);
    item.quantity = null;
  }
  // 将选择的都添加到报价单
  async function appendSelectToPrice() {
    let data: any = [];
    multipleSelection.value.map((item: any) => {
      data.push({ spec_id: item.spec_id, quantity: Number(item.quantity) || 1 });
      item.quantity = null;
    });
    if (data.length == 0) {
      $message({
        message: '请选择要添加的产品',
        type: 'warning',
      });
      return;
    }
    addQuotationInfo(JSON.stringify(data), true);
  }
  // 添加报价信息
  async function addQuotationInfo(spec_list: any, isArray: any) {
    let loadingInstance: any = null;
    if (isArray) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.4)',
      });
    }
    let res = await addQuotation({
      spec_list,
    });
    if (isArray) {
      loadingInstance.close();
    }
    if (res.code == 200) {
      $message({
        message: '添加成功',
        type: 'success',
      });
      if (isArray) {
        // multipleSelection.value = [];
        tableRef.value.clearSelection();
      }
      getQuotationInfo(null, false);
    } else {
      $message({
        message: res.msg,
        type: 'error',
      });
    }
  }
  // 获取报价单列表
  onMounted(() => {
    getQuotationInfo(null, false);
  });
  async function getQuotationInfo(reset_quotation_id: any, showDialog: any, flag = null) {
    let data: any = {
      reset_quotation_id,
    };
    if (flag === 0) {
      data.is_update_price = 0;
    } else if (flag === 1) {
      data.is_update_price = 1;
    }
    let res = await myInfo(data);
    if (res.code == 200) {
      quotationInfo.value = res.data;
      quotationTableData.value = res.data.spec_list.map((item: any, index: any) => {
        item.index = index + 1;
        return item;
      });
      shopType.value = res.data.template_id;
      // if (shopList.value.length == 0) {
      getTemplate();
      // }
      if (res.data.is_unit_price == 1) {
        quotationType.value = 0;
      } else if (res.data.is_special_ticket == 1) {
        quotationType.value = 1;
      } else if (res.data.is_special_invoice == 1) {
        quotationType.value = 2;
      }
      if (showDialog) {
        drawerAddPrise.value = true;
      }
    } else {
      quotationTableData.value = [];
    }
  }
  //报价单
  const quotationInfo = ref<any>({
    id: null,
    generation_date: null, // 日期时间
    generation_sn: null, // 订单编号
    project_name: null, // 项目名称
    customer_name: null, // 客户名称
    generation_user_name: null, // 报价人名字
    is_unit_price: null, // 价格 是否展示单价 1显示 0不显示
    is_special_ticket: null, // 是否展示专票价格 1显示 0不显示
    is_special_invoice: null, // 是否展示普票价格 1显示 0不显示
    generation_amount: null, // 报价未税金额
    generation_tax_amount: null, // 报价专票金额
    generation_tax_ordinary_amount: null, // 报价普票金额
    reference_weight_total: null, // 参考重量
    total_quantity: null, // 数量合计
    shop_id: null, // 报价公司id
    shipping_cost: null, // 是否含运费 0不含运费 1含运
    address: null, // 收货地址
  });
  const quotationType = ref<any>(null);
  async function changePriceType(value: any) {
    await editQuotation({
      quotation_id: quotationInfo.value.id,
      is_unit_price: value == 0 ? 1 : 0,
      is_special_ticket: value == 1 ? 1 : 0,
      is_special_invoice: value == 2 ? 1 : 0,
    });
    getQuotationInfo(null, false);
  }
  const isLoading = ref<any>(false);
  // 再指定位置插入
  async function appendNewItemToPrice(id: any) {
    let loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.4)',
    });
    let ind: any = '';
    if (id) {
      ind = quotationTableData.value.findIndex((item: any) => {
        return item.id == id;
      });
    } else {
      ind = quotationTableData.value.length - 1;
    }
    let res = await addQuotation({
      spec_list: JSON.stringify([{ sort: ind + 1 }]),
    });
    setTimeout(() => {
      loadingInstance.close();
    }, 300);
    if (res.code == 200) {
      quotationInfo.value.generation_amount = res.data.generation_amount;
      quotationInfo.value.generation_tax_amount = res.data.generation_tax_amount;
      quotationInfo.value.generation_tax_ordinary_amount = res.data.generation_tax_ordinary_amount;
      quotationInfo.value.reference_weight_total = res.data.reference_weight_total;
      quotationTableData.value.splice(ind + 1, 0, res.data.spec_list[0]);
      quotationTableData.value.map((item: any, index: any) => {
        item.index = index + 1;
      });
      quotationTableRef.value.setCurrentRow(quotationTableData.value[ind + 1]);
    } else {
      $message.error(res.msg);
    }
  }
  // 设置公司
  const shopType = ref<any>(null);
  async function changeShopType() {
    let res = await editQuotation({
      quotation_id: quotationInfo.value.id,
      template_id: shopType.value,
    });
    if (res.code == 200) {
      $message({
        message: '修改成功',
        type: 'success',
      });
      let result = shopList.value.filter((item: any) => item.id == shopType.value);
      if (result.length > 0) {
        remark_list.value = result[0].quotation_remark;
      }
    }
  }
  const remark_list = ref<any>([]);
  // 修改报价单信息
  async function changeValue(key: any) {
    let data: any = {
      quotation_id: quotationInfo.value.id,
    };
    data[key] = quotationInfo.value[key];
    let res = await editQuotation(data);
    if (res.code == 200) {
      if (key == 'shipping_cost' || key == 'address') {
        getTemplate();
      }
    } else {
      quotationInfo.value[key] = null;
    }
  }
  // 数量选择
  const quotationTableData = ref<any>([]);
  const multipleQuotationSelection = ref<any>([]);
  function SelectionQuotationChange(val: any) {
    multipleQuotationSelection.value = val;
  }
  function handleQuotationClick(event: any) {
    if (event.target.className.includes('el-scrollbar__wrap')) {
      quotationTableRef.value.setCurrentRow();
    }
  }
  // 清空报价单
  const clearDialog = ref<boolean>(false);
  async function clearQuotation(spec_list_id: any) {
    let res = await clearSpec({
      quotation_id: quotationInfo.value.id,
      spec_list_id,
    });
    if (res.code == 200) {
      $message({
        message: spec_list_id ? '删除成功' : '清空成功',
        type: 'success',
      });
      clearDialog.value = false;
    } else {
      $message({
        message: res.msg,
        type: 'success',
      });
    }
    getQuotationInfo(null, false);
  }
  // 删除报价单数据
  function delQuotationItem(id: any) {
    let data: any = [];
    if (id) {
      data.push(id);
    } else {
      data = multipleQuotationSelection.value.map((item: any) => {
        return item.id;
      });
    }
    if (data.length == 0) {
      $message({
        message: '请选择要删除的产品',
        type: 'warning',
      });
      return;
    }
    clearQuotation(data);
  }
  // 设置颜色
  const isRedText = ref<any>(false);
  const isBlueText = ref<any>(false);
  const isBlackText = ref<any>(false);
  function changeColor(color: any) {
    if (color == 'isRedText') {
      isRedText.value = !isRedText.value;
      isBlueText.value = false;
      isBlackText.value = false;
    } else if (color == 'isBlueText') {
      isBlueText.value = !isBlueText.value;
      isRedText.value = false;
      isBlackText.value = false;
    } else if (color == 'isBlackText') {
      isBlackText.value = !isBlackText.value;
      isRedText.value = false;
      isBlueText.value = false;
    }
  }
  async function setColor(item: any, key: any) {
    let textColor = '';
    if (isRedText.value) {
      textColor = 'red-text';
    } else if (isBlueText.value) {
      textColor = 'blue-text';
    } else if (isBlackText.value) {
      textColor = 'black-text';
    } else {
      return;
    }
    let res = await colorAdjustment({
      quotation_id: quotationInfo.value.id,
      spec_list_ids: item.id,
      color: textColor,
      field_name: key,
    });
    if (res.code == 200) {
      quotationTableData.value.map((tableItem: any) => {
        if (tableItem.id == item.id) {
          tableItem[key].color = textColor;
        }
      });
    }
  }
  // 修改数据
  async function changeTableValue(v: any, item: any, key: any) {
    let regex = /^\d+(\.\d+)?\s*(g|kg|G|KG)$/;
    if (key == 'reference_weight' && regex.test(v) == false) {
      $message({
        message: '请输入正确的重量',
        type: 'error',
      });
      return;
    }
    let data: any = {
      quotation_id: quotationInfo.value.id,
      spec_list_id: item.id,
    };
    data[key] = v;
    let res = await editSpec(data);
    if (res.code == 200) {
      quotationInfo.value.generation_amount = res.data.generation_amount;
      quotationInfo.value.generation_tax_amount = res.data.generation_tax_amount;
      quotationInfo.value.generation_tax_ordinary_amount = res.data.generation_tax_ordinary_amount;
      quotationInfo.value.reference_weight_total = res.data.reference_weight_total;
      quotationTableData.value = quotationTableData.value.map((tableItem: any, index: any) => {
        if (tableItem.id == item.id) {
          tableItem = res.data.spec_item;
        }
        tableItem.index = index + 1;
        return tableItem;
      });
    } else {
      getQuotationInfo(null, false);
    }
  }
  // 调整价格
  const adjustPriceDialog = ref<boolean>(false);
  const adjustPriceFrom = ref<any>({
    type1: 2,
    number1: '',
    type2: 2,
    number2: '',
    type3: 2,
    number3: '',
    decimal_places: 2,
  });
  function showAdjustPrice() {
    if (multipleQuotationSelection.value.length == 0) {
      $message({
        message: '请选择要调价的产品',
        type: 'error',
      });
      return;
    }
    adjustPriceDialog.value = true;
  }
  async function adjustPrice() {
    let ids: any = multipleQuotationSelection.value.map((item: any) => {
      return item.id;
    });
    let res = await priceAdjustment({
      quotation_id: quotationInfo.value.id,
      spec_list_ids: ids.join(','),
      price_adjustment_type: adjustPriceFrom.value.type1,
      price_adjustment_ratio: adjustPriceFrom.value.number1,
      price_adjustment_type_2: adjustPriceFrom.value.type2,
      price_adjustment_ratio_2: adjustPriceFrom.value.number2,
      price_adjustment_type_3: adjustPriceFrom.value.type3,
      price_adjustment_ratio_3: adjustPriceFrom.value.number3,
      decimal_places: adjustPriceFrom.value.decimal_places,
    });
    if (res.code == 200) {
      $message({
        message: '调价成功',
        type: 'success',
      });
      adjustPriceDialog.value = false;
      getQuotationInfo(null, false);
    } else {
      $message({
        message: res.msg,
        type: 'error',
      });
    }
  }
  // 获取企业列表
  const shopList = ref<any>([]);
  async function getTemplate() {
    let res = await getTemplateList({
      quotation_id: quotationInfo.value.id,
    });
    if (res.code == 200) {
      shopList.value = res.data;
      let result = shopList.value.filter((item: any) => item.id == shopType.value);
      if (result.length > 0) {
        remark_list.value = result[0].quotation_remark;
      }
    }
  }
  async function changeRemarkValue(item: any, value: any) {
    let str = item.content;
    item.content = value;
    let res = await editRemark({
      quotation_id: quotationInfo.value.id,
      remark_id: item.id,
      content: value,
    });
    if (res.code == 200) {
      remark_list.value = remark_list.value.map((ite: any) => {
        if (item.id == ite.id) {
          ite.content = value;
        }
        return ite;
      });
    } else {
      item.content = str;
    }
  }
  async function changeMarker(item: any) {
    if (item.is_require) {
      return;
    }

    let res = await editRemark({
      quotation_id: quotationInfo.value.id,
      remark_id: item.id,
      is_selected: !item.is_selected,
    });
    if (res.code == 200) {
      remark_list.value = remark_list.value.map((ite: any) => {
        if (item.id == ite.id) {
          ite.is_selected = !item.is_selected;
        }
        return ite;
      });
    }
  }
  // 添加报价单详情
  function showCreatePrice() {
    getQuotationInfo(null, true);
    nextTick(() => {
      setTimeout(() => {
        initSortable();
      }, 500);
    });
  }
  const quotationSortTableRef = ref<any>(null);
  // 排序
  function initSortable() {
    const table = quotationSortTableRef.value.$el.querySelector('.el-table__body-wrapper tbody');
    Sortable.create(table, {
      animation: 150, // 拖拽动画时长（毫秒）
      onEnd({ newIndex, oldIndex, from, to, item }: any) {
        /*将sortable移动过去的DOM复位*/
        to.removeChild(item); //删掉已移过去的dom
        from.insertBefore(item, from.children[oldIndex]); //添加已移除的dom
        // 拖拽结束时更新数据
        let list = _.cloneDeep(quotationTableData.value);
        const movedRow = list[oldIndex];
        list.splice(oldIndex, 1); // 删除原位置
        list.splice(newIndex, 0, movedRow); // 插入新位置
        let arr: any = [];
        quotationTableData.value = list.map((item: any, index: any) => {
          item.index = index + 1;
          arr.push({ spec_list_id: item.id });
          return item;
        });
        sortById(arr);
      },
    });
  }
  async function sortById(sortIds: any) {
    let res = await quotationSpecSort({
      quotation_id: quotationInfo.value.id,
      sort: JSON.stringify(sortIds),
    });
    if (res.code == 200) {
    } else {
      $message({
        message: '排序失败',
        type: 'success',
      });
      getQuotationInfo(null, false);
    }
  }
  async function nowGenerateQuotation() {
    let resList = remark_list.value
      .filter((item: any) => item.is_selected)
      .map((item: any) => {
        return {
          content: item.content,
        };
      });
    let loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.4)',
    });
    let res = await generateQuotation({
      quotation_id: quotationInfo.value.id,
      quotation_remark: JSON.stringify(resList),
      template_id: shopType.value,
    });
    loadingInstance.close();
    if (res.code == 200) {
      $message.success('生成成功');
      // 关闭弹窗
      drawerAddPrise.value = false;
      // 重新请求
      getQuotationInfo(null, false);
      // 请求详情
      priseDetailId.value = res.data.id;
      // 打开详情弹窗
      drawerPriseDetail.value = true;
    } else {
      $message.error(res.msg);
    }
  }
  const drawerAddPrise = ref<any>(false);
  const listKeyword = ref<any>(null);
  // 重新报价
  const updateDialog = ref<boolean>(false);
  const updateResetId = ref<any>(null);
  // 更新报价
  function updatePrice(flag: any) {
    getQuotationInfo(updateResetId.value, false, flag);
    updateDialog.value = false;
  }
  // 产品详情
  const dialogInfoVisible = ref<boolean>(false);
  const infoDetailId = ref<any>(null);
  function showInfoDetail(item: any) {
    dialogInfoVisible.value = true;
    infoDetailId.value = item.spec_id;
  }
  // 预览pdf
  const dialogPreviewPdf = ref<boolean>(false);
  const pdfFileUrl = ref<any>('');
  function showPreviewPdf(url: any) {
    dialogPreviewPdf.value = true;
    pdfFileUrl.value = url;
  }

  // 报价单列表
  const drawerPriseList = ref<any>(false);
  function resetPriceById(id: any) {
    drawerPriseDetail.value = false;
    drawerPriseList.value = false;
    updateDialog.value = true;
    updateResetId.value = id;
  }
  // 报价单详情
  const drawerPriseDetail = ref<any>(false);
  const priseDetailId = ref<any>(null);
  // 展示报价单详情
  function showDetailDrawer(id: any) {
    drawerPriseDetail.value = true;
    priseDetailId.value = id;
  }
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
        padding: 2px 0;
        min-height: 28px;
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
  .search-input {
    position: fixed;
    display: none;
    width: 500px;
    z-index: 66;
    .search-table {
      max-height: 206px;
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
  :deep(.el-tree-node__children .el-tree-node__content) {
    padding-left: 46px !important;
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
  :deep(.el-tree-node .el-tree-node__content:not(.el-tree-node__children .el-tree-node__content)) {
    background: #fff;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 999;
  }
  :deep(.el-tree .el-tree-node__content:not(.el-tree-node__children .el-tree-node__content):hover) {
    background: #f4f9ff;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    .label {
      color: #0066ff;
    }
  }
  :deep(.el-tree-node__children .el-tree-node:hover) {
    background: #f4f9ff;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    .label {
      color: #0066ff;
    }
  }
  :deep(.el-tree-node__children .el-tree-node:hover) {
    background: #f4f9ff;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    .label {
      color: #0066ff;
    }
  }
  :deep(.el-tree--highlight-current .el-tree-node__children .el-tree-node.is-current > .el-tree-node__content) {
    background: #f4f9ff;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    border-right: 2px solid #0066ff;
    .label {
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
      border-radius: 0px 0px 0px 0px;
      // height: 40px;
      // background: #4594fb;
      // border-radius: 4px 4px 4px 4px;
      // font-family: Microsoft YaHei;
      // font-weight: 400;
      // font-size: 14px;
      // color: #ffffff;
      // line-height: 40px;
      // text-align: center;
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
    white-space: nowrap;
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
    cursor: default;
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
      width: 58px;
      height: 30px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 30px;
      cursor: default;
    }
    .tip {
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
    .num-box {
      color: #197cfa;
      flex: 0 0 23px;
      width: 23px;
      height: 23px;
      line-height: 23px;
      text-align: center;
      border-radius: 4px;
      &.active {
        background: #197cfa;
        color: #ffffff;
      }
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
  .no-radius .drawer-content {
    border-radius: 0;
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
    .card-tips {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #0052d9;
      line-height: 20px;
      span,
      i {
        vertical-align: middle;
      }
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

  :deep(.el-table__row) {
    .table-index {
      display: block;
    }
    .table-btns {
      display: none;
    }
  }
  :deep(.el-table__row:hover) {
    .table-index {
      display: none;
    }
    .table-btns {
      display: block;
    }
  }
  :deep(.el-table__row.current-row) {
    .table-index {
      display: none;
    }
    .table-btns {
      display: block;
    }
  }

  @media screen and (min-width: 1920px) {
    .right-content {
      .list {
        flex: 0 0 640px;
        max-width: 640px;
      }
      .add-content {
        flex: 0 0 calc(100% - 650px);
        max-width: calc(100% - 650px);
      }
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1920px) {
    .right-content {
      .list {
        flex: 0 0 560px;
        max-width: 560px;
      }
      .add-content {
        flex: 0 0 calc(100% - 570px);
        max-width: calc(100% - 570px);
      }
    }
  }
  @media screen and (max-width: 1440px) {
    .right-content {
      .list {
        flex: 0 0 490px;
        max-width: 490px;
      }
      .add-content {
        flex: 0 0 calc(100% - 500px);
        max-width: calc(100% - 500px);
      }
    }
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
    height: 380px;
  }
  .el-dialog.dialog-self2 {
    height: 80%;
  }
  .el-dialog.dialog-self3 {
    height: 100%;
  }
  .el-dialog.dialog-self4 {
    height: 240px;
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
  input {
    font-size: 14px !important;
  }
  .table-input input::placeholder {
    font-size: 14px !important;
    color: #333333 !important;
  }
  .quantity-input input::placeholder {
    font-size: 14px !important;
    color: #666 !important;
  } /* 针对 Chrome、Safari、Edge、Opera */
  .quantity-input .el-input__inner::-webkit-outer-spin-button,
  .quantity-input .el-input__inner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  /* 针对 Firefox */
  .quantity-input .el-input__inner {
    appearance: none;
    -moz-appearance: textfield;
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
  .red-text {
    color: #f00000 !important;
  }
  .red-text .el-input__inner {
    color: #f00000 !important;
  }
  .black-text {
    color: #333 !important;
  }
  .black-text .el-input__inner {
    color: #333 !important;
  }
  .blue-text {
    color: #000bda !important;
  }
  .blue-text .el-input__inner {
    color: #000bda !important;
  }
  .el-table__header,
  .el-table__footer {
    margin: 0 auto;
  }
  .el-scrollbar__view {
    display: block !important;
  }
</style>
