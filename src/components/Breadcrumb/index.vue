<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path+index">
        <span
          v-if="!!item.meta.subMenu || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.name }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.name }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from "path-to-regexp";

export default {
  data() {
    return {
      levelList: []
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      //有name的就是菜单，就显示在面包屑上，但是过滤掉“下拉菜单”这个父路由
      let matched = this.$route.matched.filter(
        (item) => !!item.name && item.name !== '下拉菜单'
      );
      const first = matched[0];

      if (!this.isDashboard(first)) {
        matched = [{ name: "首页", path: "/dashboard", meta: {} }].concat(
          matched
        );
      }
      // console.log(matched)//for debug
      this.levelList = matched;
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim() === "首页"
      );
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { path } = item;
      this.$router.push(this.pathCompile(path));
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
