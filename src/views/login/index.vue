<template>
  <!-- 登录 -->
  <div class="go-login-box">
    <div class="go-login-box-bg">
      <aside class="bg-slot"></aside>
      <aside class="bg-img-box">
        <transition-group name="list-complete">
          <template v-for="item in bgList" :key="item">
            <div class="bg-img-box-li list-complete-item">
              <n-collapse-transition :appear="true" :show="showBg">
                <img :src="getImageUrl(item, 'chart/charts')" alt="chart" />
              </n-collapse-transition>
            </div>
          </template>
        </transition-group>
      </aside>
    </div>
    <layout-header></layout-header>

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import shuffle from 'lodash/shuffle'
import { carouselInterval } from '@/settings/designSetting'
import { useSystemStore } from '@/store/modules/systemStore/systemStore'
import { SystemStoreUserInfoEnum, SystemStoreEnum } from '@/store/modules/systemStore/systemStore.d'
import { GoThemeSelect } from '@/components/GoThemeSelect'
import { GoLangSelect } from '@/components/GoLangSelect'
import { LayoutHeader } from '@/layout/components/LayoutHeader'
import { LayoutFooter } from '@/layout/components/LayoutFooter'
import { PageEnum } from '@/enums/pageEnum'
// import { GO_LOGIN_INFO_STORE } from '@/enums/storageEnum'
import { icon } from '@/plugins'
import { routerTurnByName, cryptoEncode, setLocalStorage } from '@/utils'
import { loginApi } from '@/api/path'

const { PersonOutlineIcon, LockClosedOutlineIcon } = icon.ionicons5

const formRef = ref()
const loading = ref(false)
const autoLogin = ref(true)
const show = ref(false)
const showBg = ref(false)
const systemStore = useSystemStore()

const t = window['$t']

const formInline = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: {
    required: true,
    message: t('global.form_account'),
    trigger: 'blur',
  },
  password: {
    required: true,
    message: t('global.form_password'),
    trigger: 'blur',
  },
}

// 定时器
const shuffleTimiing = ref()

// 轮播图
const carouselImgList = ['one', 'two', 'three']

// 背景图
const bgList = ref([
  'bar_y',
  'bar_x',
  'line_gradient',
  'line',
  'funnel',
  'heatmap',
  'map',
  'pie',
  'radar',
])

// 处理url获取
const getImageUrl = (name: string, folder: string) => {
  return new URL(`../../assets/images/${folder}/${name}.png`, import.meta.url).href
}

// 打乱图片顺序
const shuffleHandle = () => {
  shuffleTimiing.value = setInterval(() => {
    bgList.value = shuffle(bgList.value)
  }, carouselInterval)
}

// 登录
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      const { username, password } = formInline
      loading.value = true
      setLocalStorage(
        'GO_LOGIN_INFO',
        cryptoEncode(
          JSON.stringify({
            username,
            password,
          })
        )
      )
      window['$message'].success(`${t('login.login_success')}!`);
      console.log('PageEnum.BASE_HOME_NAME =', PageEnum.BASE_HOME_NAME);
      routerTurnByName(PageEnum.BASE_HOME_NAME, true)
    } else {
      window['$message'].error(`${t('login.login_message')}!`)
    }
  });
  // formRef.value.validate(async (errors: any) => {
  //   if (!errors) {
  //     const { username, password } = formInline
  //     loading.value = true
  //     // 提交请求
  //     const res = await loginApi({
  //       username,
  //       password
  //     })
  //     if(res && res.data) {
  //       const { tokenValue, tokenName } = res.data.token
  //       const { nickname, username, id } = res.data.userinfo

  //       // 存储到 pinia 
  //       systemStore.setItem(SystemStoreEnum.USER_INFO, {
  //         [SystemStoreUserInfoEnum.USER_TOKEN]: tokenValue,
  //         [SystemStoreUserInfoEnum.TOKEN_NAME]: tokenName,
  //         [SystemStoreUserInfoEnum.USER_ID]: id,
  //         [SystemStoreUserInfoEnum.USER_NAME]: username,
  //         [SystemStoreUserInfoEnum.NICK_NAME]: nickname,
  //         t
  //       })
        
  //       window['$message'].success(t('login.login_success'))
  //       routerTurnByName(PageEnum.BASE_HOME_NAME, true)
  //     }
  //     loading.value = false
  //   } else {
  //     window['$message'].error(t('login.login_message'))
  //   }
  // })
}

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 300)

  setTimeout(() => {
    showBg.value = true
  }, 100)

  shuffleHandle()

  // 读取环境变量
  const redirectUrl = import.meta.env.VITE_LOGIN_REDIRECT_URL
  if (redirectUrl) {
    window.location.replace(redirectUrl)
  }
})
</script>

<style lang="scss" scoped>
$width: 450px;
$go-login-height: 100vh;
$account-img-height: 210px;
$footer-height: 50px;
$carousel-width: 30%;
$carousel-image-height: 60vh;

* {
  box-sizing: border-box;
}
@include go(login-box) {
  height: $go-login-height;
  overflow: hidden;
  @include background-image('background-image');
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    height: $--header-height;
  }
  &-divider {
    margin: 0;
    padding-top: 0;
  }

  @include go(login) {
    z-index: 2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: -$--header-height;
    height: $go-login-height;
    width: 100vw;
    &-carousel {
      width: $carousel-width;
      margin-top: 100px;
      min-width: 500px;
      &-img {
        display: block;
        margin: 0 auto;
        height: $carousel-image-height;
      }
    }
    .login-account {
      display: flex;
      flex-direction: column;
      margin: 0 160px;
      &-container {
        width: $width;
      }

      &-card {
        @extend .go-background-filter;
        @include fetch-bg-color('filter-color');
        box-shadow: 0 0 20px 5px rgba(40, 40, 40, 0.3);
      }

      &-top {
        padding-top: 10px;
        text-align: center;
        height: $account-img-height;
        margin-bottom: 20px;
      }
    }
  }

  &-footer {
    z-index: 2;
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  &-bg {
    z-index: 0;
    position: fixed;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: url('@/assets/images/login/login-bg.png') no-repeat 0 -120px;
    .bg-slot {
      width: $carousel-width;
    }
    .bg-img-box {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      width: 770px;
      margin-right: -20px;
      &-li {
        img {
          margin-right: 20px;
          margin-top: 20px;
          width: 230px;
          border-radius: 2 * $--border-radius-base;
          opacity: 0.9;
        }
      }
    }
  }
}
@media only screen and (max-width: 1200px) {
  .bg-img-box,
  .bg-slot,
  .go-login-carousel {
    display: none !important;
  }
  .go-login-box-footer {
    position: relative;
  }
}
</style>
