<template>
  <div v-if="!item.hidden">
    <template v-if="showByMenuItem(item.children, item)">
      <app-link v-if="menuItem.path" :to="menuItem.path">
        <el-menu-item
          :index="menuItem.path"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item :icon="menuItem.iconCls" :title="menuItem.name" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.path+item.name" popper-append-to-body>
      <template slot="title">
        <item :icon="item.iconCls" :title="item.name" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
// import path from "path";
// import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.menuItem = null;
    return {};
  },
  methods: {
    /**
     * @description 是否渲染成菜单项
     * @param children 如果传过来的是undefined，则为默认值[]；切记，传过来的是null的话，则为null，不是默认值
     * @returns true：该组件的渲染结果就是菜单项；false：该组件的渲染结果就是子菜单
     */
    showByMenuItem(children = [], parent) {
      let showingChildren;
      if (children == null) {
        showingChildren = [];
      } else {
        //过滤
        showingChildren = children.filter((item) => {
          if (item.hidden) {
            return false;
          } else if (!!item.parentId) {
            //parentId不为null
            return true;
          } else {
            //孩子的parentId为null，则表示是一级菜单
            this.menuItem = item; //则将这个一级菜单渲染成菜单项
            return false;
          }
        });
      }

      //没有孩子要显示，则渲染成菜单项
      if (showingChildren.length === 0) {
        //显示parent自己
        this.menuItem = this.menuItem == null ? parent : this.menuItem;
        return true;
      }

      return false;
    },
    // resolvePath(routePath) {
    //   if (isExternal(routePath)) {
    //     return routePath;
    //   }
    //   if (isExternal(this.basePath)) {
    //     return this.basePath;
    //   }
    //   return path.resolve(this.basePath, routePath);
    // },
  },
};
</script>
