<template>
  <div class="left-navbar">
    <div class="top-navbar-self">
      <div @click="showCategoryBox" class="flex-between pl-15 pr-11 cursor-pointer w-100% h-100%">
        <div>电力金具</div>
        <img :src="$getAssetsImages('price/icon-more.png')" alt="" />
      </div>
      <div class="level-box scroll-none" v-if="showCategory" @click="closeCategoryBox">
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8 active">电力金具 </div>
        <div class="level-one px-8">变压器</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
        <div class="level-one px-8">电缆电压</div>
      </div>
      <div class="popup-box-bg z-99" v-if="showCategory" @click="closeCategoryBox"> </div>
    </div>
    <div>
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
        highlight-current
        :default-expanded-keys="expandedKeys"
        node-key="id"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="label" :class="data.children && data.children.length > 0 ? 'level1' : ''">{{ node.label }} </div>
            <div v-if="data.children && data.children.length > 0" class="pr-20">
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
        <el-input placeholder="" v-model="keyword" clearable @focus="showSearchTable = true" style="position: relative; z-index: 88">
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
            <div v-for="item of 210" :key="item" class="table-tr flex-center">
              <div class="f-48 pl-30">{{ item }}低压铜芯电缆</div>
              <div class="f-26 pl-8">YJV</div>
              <div class="f-26 pl-8">3×16+1×10</div>
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
              <el-dropdown-item class="select-type">全部</el-dropdown-item>
              <el-dropdown-item class="select-type">3+1芯</el-dropdown-item>
              <el-dropdown-item class="select-type active">3+2芯</el-dropdown-item>
              <el-dropdown-item class="select-type">4+1芯</el-dropdown-item>
              <el-dropdown-item class="select-type">5芯</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="select-btn flex-between cursor-pointer">
          <img :src="$getAssetsImages('price/icon-pltj.png')" alt="" />
          <span mx-6>批量添加</span>
          <div class="num">{{ multipleSelection.length ? multipleSelection.length : '' }}</div>
        </div>
      </div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>铁附件</el-breadcrumb-item>
        <el-breadcrumb-item>铁附件</el-breadcrumb-item>
        <el-breadcrumb-item>耐张横担</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="calc(100% - 216px)"
        ref="tableRef"
        class="self-hover-table"
        table-layout="fixed"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column label="产品名称">
          <template #default="scope">
            <div class="table-name">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price" width="90">
          <template #default="scope">
            <div class="flex-center">
              <div v-if="scope.row.isChange">{{ scope.row.price }}</div>
              <el-input class="table-input" v-model="scope.row.price" style="width: 80px" placeholder="1" v-else />
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
              <div @click="handleCopy(scope.row.name)" class="flex-center">
                <img :src="$getAssetsImages('price/icon-copy.png')" alt="" />
              </div>
              <div class="ml-4">加入报价单</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add-content">
      <div class="head-title flex-between px-20 mb-6">
        <div class="left-title">报价单</div>
        <div class="add-btns">
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
          <div class="add-btns ml-10">
            <img :src="$getAssetsImages('price/icon-add.png')" alt="" class="mr-4" />
            <span>新增空白数据</span>
          </div>
          <div class="add-btns ml-10">
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
          :data="quotationTableData"
          class="no-radius"
          style="width: 100%"
          height="100%"
          ref="tableRef"
          table-layout="fixed"
          highlight-current-row
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentChange"
        >
          <el-table-column label="" width="30" cell-class-name="center-cell">
            <template #default="scope">
              <div class="flex-center">
                <img :src="$getAssetsImages('price/icon-del-one.png')" alt="" @click="console.log(scope.row.id)" />
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
    <el-dialog v-model="dialogInfoVisible" width="1138" class="dialog-self dialog-self2" :show-close="false" align-center>
      <img :src="$getAssetsImages('price/icon-clos.png')" alt="" class="close2" @click="dialogInfoVisible = false" />
      <div class="dialog-title2 pt-24 pb-24">产品详情</div>
      <div class="px-46" style="height: calc(100% - 120px)">
        <div class="mb-30 flex">
          <div>
            <div class="big-img">
              <img :src="$getAssetsImages('price/image-01.png')" alt="" />
            </div>
            <div class="flex mt-18">
              <div class="left-btn flex-center cursor-pointer mr-7">
                <img :src="$getAssetsImages('price/left-gray.png')" alt="" />
              </div>
              <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
              <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
              <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
              <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
              <img :src="$getAssetsImages('price/image-01.png')" alt="" class="img-item mr-7" />
              <div class="right-btn flex-center cursor-pointer">
                <img :src="$getAssetsImages('price/right-gray.png')" alt="" />
              </div>
            </div>
          </div>
          <div class="ml-24 info">
            <div class="info-title mb-16"
              >铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆铜芯交联聚乙烯 绝缘聚氯乙烯护套电力电缆
              <span class="cursor-pointer" @click="handleCopy('铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆铜芯交联聚乙烯 绝缘聚氯乙烯护套电力电缆')"
                ><img :src="$getAssetsImages('price/icon-copy.png')" alt="" /> 一键复制</span
              >
            </div>
            <div class="cate flex mb-7">
              <div class="cate-item active">123</div>
              <div class="cate-item">123</div>
              <div class="cate-item">123</div>
              <div class="cate-item">123</div>
            </div>
            <div class="price-box flex-between items-center px-20 mb-20">
              <div class="text-center">
                <span>单价：</span>
                <span>7.2</span>
              </div>
              <div class="text-center">
                <span>专票：</span>
                <span>7.2</span>
              </div>
              <div class="text-center">
                <span>普票：</span>
                <span>7.2</span>
              </div>
            </div>
            <div class="info-unit flex flex-wrap">
              <div>
                <span class="label">重量：</span>
                <span class="value">10.4kg/根</span>
                <span class="label">单位：</span>
                <span class="value">根</span>
              </div>
              <div>
                <span class="label">重量：</span>
                <span class="value">10.4kg/根</span>
                <span class="label">单位：</span>
                <span class="value">根</span>
              </div>
              <div>
                <span class="label">重量：</span>
                <span class="value">10.4kg/根</span>
                <span class="label">单位：</span>
                <span class="value">根</span>
              </div>
              <div>
                <span class="label">重量：</span>
                <span class="value">10.4kg/根</span>
                <span class="label">单位：</span>
                <span class="value">根</span>
              </div>
              <div>
                <span class="label">重量：</span>
                <span class="value">10.4kg/根</span>
                <span class="label">单位：</span>
                <span class="value">根</span>
              </div>
              <div>
                <span class="label">重量：</span>
                <span class="value">10.4kg/根</span>
                <span class="label">单位：</span>
                <span class="value">根</span>
              </div>
            </div>
            <div class="mt-20">
              <div class="ml-20 dialog-num flex items-center">
                <span>数量：</span>
                <el-input placeholder="请输入" v-model="dialog_num">
                  <template #suffix>
                    <div class="flex-center flex-columns" style="height: 100%">
                      <div @click="changDialogNum('+')" class="flex-center pt-4" style="flex: 0 0 50%" cursor-pointer>
                        <img :src="$getAssetsImages('price/icon-up.png')" alt="" />
                      </div>
                      <div @click="changDialogNum('-')" class="flex-center pb-4" style="flex: 0 0 50%" cursor-pointer>
                        <img :src="$getAssetsImages('price/icon-down.png')" alt="" />
                      </div>
                    </div>
                  </template>
                </el-input>
                <div class="add-btn cursor-pointer ml-20">加入报价单</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-card flex mb-18">
          <div class="mr-46" :class="{ active: activeTab == 1 }" @click="activeTab = 1">产品详情</div>
          <div :class="{ active: activeTab == 2 }" @click="activeTab = 2">供应商</div>
        </div>
        <el-scrollbar height=" calc(100% - 460px)" :always="true" v-if="activeTab == 1">
          <div class="card-list">
            <div class="flex my-24">
              <span class="label">产品名称</span>
              <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
            </div>
            <div class="flex mb-24">
              <span class="label">产品名称</span>
              <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
            </div>
            <div class="flex mb-24">
              <span class="label">产品名称</span>
              <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
            </div>
            <div class="flex mb-24">
              <span class="label">产品名称</span>
              <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
            </div>
            <div class="flex mb-24">
              <span class="label">产品名称</span>
              <span class="value">铜芯交联聚乙烯绝缘聚氯乙烯护套电力电缆</span>
            </div>
            <div class="flex mb-24">
              <span class="label">检验报告</span>
              <span class="files">
                <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
                <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
                <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
                <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
                <div class="mb-14"><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>产品检验报告1.pdf</span></div>
              </span>
            </div>
            <div class="flex mb-24">
              <span class="label">执行标准</span>
              <span class="files">
                <div class="mb-14"
                  ><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div
                >
                <div class="mb-14"
                  ><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div
                >
                <div class="mb-14"
                  ><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div
                >
                <div class="mb-14"
                  ><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div
                >
                <div class="mb-14"
                  ><img :src="$getAssetsImages('price/icon-report.png')" alt="" class="mr-4" /><span>GB/T 12706.1-2020.pdf</span></div
                >
              </span>
            </div>
          </div>
        </el-scrollbar>
        <el-table :data="dialogTableData" style="width: 100%" center height=" calc(100% - 460px)" v-else class="table-center">
          <el-table-column prop="company" label="公司名称" />
          <el-table-column prop="name" label="负责人名称" width="120" />
          <el-table-column prop="phone" label="电话" width="150" />
          <el-table-column prop="address" label="地址" />
          <el-table-column prop="remark" label="备注信息" />
        </el-table>
      </div>
    </el-dialog>
  </div>
  <el-drawer v-model="drawerAddPrise" direction="rtl" :with-header="false" size="1280">
    <template #default>
      <div class="drawer-content">
        <img :src="$getAssetsImages('price/icon-close3.png')" alt="" class="close" @click="dialogInfoVisible = false" />
        <div class="drawer-title pt-24 pb-28">
          <img :src="$getAssetsImages('price/icon-title1.png')" alt="" @click="dialogInfoVisible = false" class="mr-10" />
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
          <div class="mb-20 flex-between">
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
              <div class="add-btns ml-10">
                <img :src="$getAssetsImages('price/icon-add.png')" alt="" class="mr-4" />
                <span>新增空白数据</span>
              </div>
              <div class="add-btns ml-10">
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
          <el-table
            :data="quotationTableData"
            class="no-radius self-hover-table"
            style="width: 100%; border-radius: 0"
            height="402px"
            ref="tableRef"
            table-layout="fixed"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChange"
          >
            <el-table-column label="" width="30" cell-class-name="center-cell">
              <template #default="scope">
                <div class="flex-center">
                  <img :src="$getAssetsImages('price/icon-del-one.png')" alt="" @click="console.log(scope.row.id)" />
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
          <div class="mt-18 flex">
            <div class="label">报价公司：</div>
            <div>
              <el-radio-group v-model="radioType">
                <el-radio :value="0"
                  ><img :src="$getAssetsImages('price/logo-company.png')" alt="" @click="dialogInfoVisible = false" class="mr-6" />
                  <span>公司名称公司名称1</span>
                </el-radio>
                <el-radio :value="1">
                  <img :src="$getAssetsImages('price/logo-company.png')" alt="" @click="dialogInfoVisible = false" class="mr-6" />
                  <span>公司名称公司名称1</span>
                </el-radio>
                <el-radio :value="2">
                  <img :src="$getAssetsImages('price/logo-company.png')" alt="" @click="dialogInfoVisible = false" class="mr-6" />
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
</template>

<script setup lang="ts">
  import { ArrowRight } from '@element-plus/icons-vue';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  // 一级分类
  const showCategory = ref<boolean>(false);
  function showCategoryBox() {
    showCategory.value = true;
  }
  function closeCategoryBox() {
    showCategory.value = false;
  }
  // 二级分类
  const data = ref<any>([
    {
      id: 1,
      label: '铁附件',
      children: [
        {
          id: 121,
          label: '铁附件21',
        },
      ],
    },
    {
      id: 2,
      label: '抱箍',
      children: [
        {
          id: 11,
          label: '抱箍21',
        },
        {
          id: 12,
          label: '抱箍22',
        },
      ],
    },
    {
      id: 3,
      label: '横担',
      children: [
        {
          id: 4,
          label: '引线横担',
        },
        {
          id: 5,
          label: '避雷器横担',
        },
        {
          id: 6,
          label: '跌落横担（联板）',
        },
        {
          id: 7,
          label: '刀闸横担（联板）',
        },
        {
          id: 8,
          label: '双杆横担',
        },
      ],
    },
  ]);
  const defaultProps = {
    children: 'children',
    label: 'label',
  };
  const expandedKeys = ref([3, 4]);
  function handleNodeClick(data: any) {
    console.log(data);
  }
  // 搜索
  const keyword = ref<any>(null);
  const showSearchTable = ref<boolean>(false);
  function closeSearchTable() {
    showSearchTable.value = false;
  }
  // 表格
  const tableData = ref<any>([
    {
      id: 1,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 2,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 3,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 4,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 5,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 6,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
    {
      id: 7,
      name: 'YJV22 26/35KV 3×120',
      price: 168,
      number: null,
      selected: false,
      isChange: false,
      isActive: false,
    },
  ]);
  const tableRef = ref<any>();
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
  // 价格
  const dialogTableVisible = ref<boolean>(false);
  const adjustPriceFrom = ref<any>({
    number1: '',
    type1: 1,
    number2: '',
    type2: 1,
    number3: '',
    type3: 1,
  });
  // 详情
  const dialogInfoVisible = ref<boolean>(false);
  const dialog_num = ref<any>(0);
  const activeTab = ref<number>(1);
  const dialogTableData = ref<any>([
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
    {
      company: '山西维斯特洛科技有限公司',
      name: '李晨光',
      phone: '13513549160',
      address: '山西省太原市迎泽区龙堡街29号',
      remark: '备注信息',
    },
  ]);
  function changDialogNum(type: any) {
    if (type == '+') {
      dialog_num.value += 1;
    } else {
      dialog_num.value -= 1;
      if (dialog_num.value < 0) {
        dialog_num.value = 0;
      }
    }
  }
  // 添加报价单详情
  const drawerAddPrise = ref<any>(false);
  const shippingCost = ref<any>(true);
  const isActive = ref<any>(true);
  // 报价单列表
  const drawerPriseList = ref<any>(false);
  const listKeyword = ref<any>(null);
  const listTime = ref<any>(null);
  const ListData = ref<any>([
    {
      id: 1,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 2,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 3,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 4,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 5,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 6,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 7,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 8,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 9,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 10,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 11,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 12,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 13,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 14,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 15,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 16,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 17,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 18,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 19,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
    {
      id: 20,
      money: 150,
      price: 'YJV22 26/35KV 3×120',
      name: '客户名称客户名称客户名称',
      code: 'WDDL-20241218-0001',
      people: '康松材料商',
      time: '2025.01.08 15:59',
    },
  ]);

  const detailList = ref<any>([
    {
      id: 1,
      index: 1,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 2,
      index: 2,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 3,
      index: 3,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 4,
      index: 4,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 5,
      index: 5,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 6,
      index: 6,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 7,
      index: 7,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 8,
      index: 8,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 9,
      index: 9,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 10,
      index: 10,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 11,
      index: 11,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 12,
      index: 12,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 13,
      index: 13,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 14,
      index: 14,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 15,
      index: 15,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 16,
      index: 16,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 17,
      index: 17,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 18,
      index: 18,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 19,
      index: 19,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
    {
      id: 20,
      index: 20,
      name: '产品名称产品名称产品名称产品名称',
      specs: 'YJV22 26/35KV 3×120',
      num: '50米',
      price: '168元',
      total: '4900元',
    },
  ]);

  // 报价单详情
  const drawerPriseDetail = ref<any>(false);
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
    .list {
      padding: 16px;
      flex: 0 0 calc(42% - 10px);
      min-width: 680px;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(72, 94, 132, 0.1);
      border-radius: 8px 8px 8px 8px;
    }
    .add-content {
      flex: 0 0 58%;
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
    width: 17px;
    height: 17px;
    content: '';
    border: 0;
    size: 0;
    background-color: transparent;
    background: url('@/assets/images/price/Vector.png');
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
    display: none;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: url('@/assets/images/price/Vector1.png');
  }
  :deep(.el-dialog__header) {
    padding: 0;
    height: 0;
  }
  :deep(.dialog-self) {
    position: relative;
    padding: 0;
    border-radius: 12px 12px 12px 12px;
    height: 349px;
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
  :deep(.el-dialog__body) {
    height: 100%;
    overflow: hidden;
  }
  :deep(.dialog-self2) {
    height: 80%;
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
  :deep(.el-dialog) {
    padding: 0;
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
