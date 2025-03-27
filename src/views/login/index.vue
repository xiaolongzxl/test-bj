<template>
  <div class="login-header flex-start pl-24"> <img :src="$getAssetsImages('logo/logo.png')" alt="" style="height: 36px" /> </div>
  <div class="login-body flex justify-evenly items-center">
    <div class="login-img">
      <div>
        <span class="t1 mr-18">建设智慧电网</span>
        <span class="t2">做强数字电网</span>
      </div>
      <div class="t3">欢迎加入万达电力，开启美好生活</div>
      <img :src="$getAssetsImages('login/img-tec.png')" alt="" class="img1 ml-54" />
    </div>
    <div class="login-box">
      <div class="login-title">
        <span>欢迎加入</span>
        <span>万达电力</span>
      </div>
      <div class="card-tab flex mt-48 mb-52">
        <span :class="{ active: activeTab == 1 }" @click="changeTab(1)" class="no-select cursor-pointer mr-40">验证码登录</span>
        <span :class="{ active: activeTab == 2 }" @click="changeTab(2)" class="no-select cursor-pointer">账号登录</span>
      </div>
      <el-form width="100%" :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="phone" :rules="rules.phone">
          <el-input placeholder="请输入手机号" v-model="form.phone">
            <template #prefix>
              <img :src="$getAssetsImages('login/icon-num.png')" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" :rules="rules.code" v-if="activeTab == 1" class="mt-24 mb-22">
          <el-input placeholder="请输入验证码" v-model="form.code">
            <template #prefix>
              <img :src="$getAssetsImages('login/icon-password.png')" alt="" />
            </template>
            <template #suffix>
              <div class="mr-20 yzm no-select cursor-pointer" @click="getYzm">{{ isSend ? time + 's' : '获取验证码' }} </div>
            </template>
          </el-input></el-form-item
        >
        <el-form-item prop="password" :rules="rules.password" v-if="activeTab == 2" class="mt-24 mb-22">
          <el-input placeholder="请输入密码" show-password v-model="form.password">
            <template #prefix>
              <img :src="$getAssetsImages('login/icon-password.png')" alt="" />
            </template>
          </el-input>
        </el-form-item>

        <div class="flex-between">
          <el-checkbox label="记住密码" v-model="remember_password" true-value="1" false-value="0" />
          <el-checkbox label="自动登录" v-model="auto_login" true-value="1" false-value="0" />
        </div>
        <div class="login-btn cursor-pointer text-center mt-26 mb-20" @click="loginNow"> 立即登录 </div>
        <div class="tips">登录视为您已阅读并同意<span>服务条款</span>和<span>隐私政策</span></div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { verifyLogin, sendVerifyCode, login } from '@/api/login.ts';
  import { ElLoading } from 'element-plus';
  import { useRouter } from 'vue-router';
  const $getAssetsImages = getCurrentInstance()?.appContext.config.globalProperties.$getAssetsImages;
  const $message: any = getCurrentInstance()?.appContext.config.globalProperties.$message;
  const activeTab = ref<number>(1);
  const router = useRouter();
  const userInfoStore: any = UserStore();
  function changeTab(num: number) {
    activeTab.value = num;
  }
  const form = ref<any>({
    phone: '',
    code: '',
    password: '',
  });
  const isSend = ref<boolean>(false);
  const time = ref<number>(60);
  const timer = ref<any>(null);
  const formRef = ref<any>(null);
  // 自定义手机号验证
  const validatePhone = (_rule: any, value: any, callback: any) => {
    const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号规则
    if (!value) {
      callback(new Error('请输入手机号'));
    } else if (!phoneRegex.test(value)) {
      callback(new Error('请输入正确的手机号'));
    } else {
      callback();
    }
  };
  const rules = reactive<any>({
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    code: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
  });

  async function getYzm() {
    if (!isSend.value) {
      const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号规则
      if (!form.value.phone) {
        $message({
          message: '请填写手机号码',
          type: 'warning',
        });
        return;
      } else if (!phoneRegex.test(form.value.phone)) {
        $message({
          message: '请输入正确的手机号',
          type: 'warning',
        });
        return;
      }
      isSend.value = true;
      let loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.4)',
      });
      let res = await sendVerifyCode({
        phone: form.value.phone,
      });
      loadingInstance.close();
      if (res.code == 200) {
        $message({
          message: '发送成功',
          type: 'success',
        });
        timer.value = setInterval(() => {
          time.value -= 1;
          if (time.value == 0) {
            isSend.value = false;
            time.value = 60;
            clearInterval(timer.value);
          }
        }, 1000);
      } else {
        isSend.value = false;
      }
    }
  }
  const remember_password = ref<any>(0);
  const auto_login = ref<any>(0);
  function loginNow() {
    formRef.value.validate(async (valid: any) => {
      console.log(valid);
      if (valid) {
        let res = null;
        if (activeTab.value == 1) {
          res = await verifyLogin({
            phone: form.value.phone,
            verify_code: form.value.code,
            auto_login: auto_login.value,
          });
        } else if (activeTab.value == 2) {
          res = await login({
            phone: form.value.phone,
            password: form.value.password,
            auto_login: auto_login.value,
          });

          if (remember_password.value == 1) {
            window.localStorage.setItem('user_name', form.value.phone);
            window.localStorage.setItem('user_password', form.value.password);
          } else {
            window.localStorage.setItem('user_name', '');
            window.localStorage.setItem('user_password', '');
          }
        }
        window.localStorage.setItem('remember_password', remember_password.value);
        window.localStorage.setItem('auto_login', auto_login.value);
        if (res.code == 200) {
          let data = {
            nickname: res.data.user_info.nickname,
            avatar: res.data.user_info.avatar,
            phone: res.data.user_info.phone,
            area: res.data.user_info.area,
            company_name: res.data.user_info.company_name,
          };
          userInfoStore.setUserInfo(data);
          window.localStorage.setItem('token', res.data.token);
          $message({
            message: '登录成功',
            type: 'success',
          });
          setTimeout(() => {
            router.push('/price');
          }, 1000);
        } else {
          $message({
            message: res.msg,
            type: 'error',
          });
        }
      }
    });
  }

  onMounted(() => {
    auto_login.value = window.localStorage.getItem('auto_login') || 0;
    remember_password.value = window.localStorage.getItem('remember_password') || 0;
    form.value.phone = window.localStorage.getItem('user_name') || '';
    form.value.password = window.localStorage.getItem('user_password') || '';
  });
</script>

<style scoped lang="less">
  .login-header {
    width: 100%;
    height: 70px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    box-shadow: 0px 3px 6px 0px rgba(128, 128, 128, 0.2);
    position: relative;
    z-index: 9;
  }
  .login-body {
    // padding: 0 334px;
    height: calc(100% - 70px);
    background: url('@/assets/images/login/bg-login.png') no-repeat;
    background-position: center center;
    background-size: 100% 100%;
  }
  .login-img {
    width: 480px;
    .t1 {
      font-family: Microsoft YaHei UI;
      font-weight: bold;
      font-size: 37px;
      color: #0158f9;
      line-height: 48px;
    }
    .t2 {
      font-family: Microsoft YaHei UI;
      font-weight: bold;
      font-size: 37px;
      color: #171b1e;
      line-height: 48px;
    }
    .t3 {
      margin: 25px 0 50px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #171b1e;
      line-height: 18px;
    }
    .img1 {
      width: 360px;
    }
  }
  .login-box {
    padding: 60px 50px 50px;
    width: 480px;
    min-height: 520px;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(128, 145, 168, 0.3);
    border-radius: 10px 10px 10px 10px;
    border: 3px solid #ffffff;
    .login-title {
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 24px;
      color: #171b1e;
      line-height: 32px;
      span:last-child {
        color: #0158f9;
      }
    }
  }
  .card-tab {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #717579;
    line-height: 20px;
    .active {
      position: relative;
      font-weight: bold;
      color: #0158f9;
      &::after {
        position: absolute;
        content: '';
        bottom: -16px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #0158f9;
        border-radius: 0px 0px 0px 0px;
      }
    }
  }
  .login-btn {
    width: 100%;
    height: 40px;
    background: #0158f9;
    border-radius: 4px 4px 4px 4px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 14px;
    color: #ffffff;
    line-height: 40px;
  }
  .yzm {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #2d6cff;
    line-height: 14px;
  }
  .tips {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #717579;
    line-height: 16px;
    span {
      color: #2d6cff;
    }
  }
  :deep(.el-form-item__error) {
    padding-top: 4px;
  }
  :deep(.el-input__wrapper) {
    height: 40px;
    background: #f4f5f7;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #ffffff;
    box-shadow: none !important;
  }
  :deep(.el-checkbox__label) {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #171b1e !important;
    line-height: 18px;
    margin-top: -1px;
  }
  :deep(.el-checkbox__input .el-checkbox__inner) {
    border-color: #999;
    border-width: 1.5px;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    border-width: 1px;
    background-color: #2d6cff;
    border-color: #2d6cff;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
    border-width: 2px;
  }
</style>
<style>
  input::placeholder {
    font-family: Microsoft YaHei !important;
    font-weight: 400 !important;
    font-size: 14px !important;
    color: #999999 !important;
  }
</style>
