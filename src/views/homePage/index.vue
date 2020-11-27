<template>
  <div class="home">
    <el-button type="primary" @click="addLibQa">点击展开问答</el-button>
    <el-drawer
      title=""
      :visible.sync="qaDrawer"
      direction="rtl"
      size="1100px"
      class="search-drawer"
      append-to-body
    >
      <qaModel
        :isQa="isQa"
        :selectQaMode="selectQaMode"
        ref="qaChild"
      >
        <!-- @sendData="leaveLibQa"
        :deliverData="qaCOlumns" -->
      </qaModel>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import QaModel from "@/components/qaModel/index.vue";

@Component({
  components: {
    qaModel: QaModel,
  },
})
export default class Home extends Vue {
  qaDrawer = false;
  isQa = true;
  selectQaMode = "";
  selectModule = 0;

  addLibQa() {
    setTimeout(() => {
      this.qaDrawer = true;
      this.isQa = true;
      this.selectQaMode = "qaMode";
      this.selectModule = 0;
      setTimeout(() => {
        (this.$refs["qaChild"] as QaModel).getFatherData();
      }, 0);
    }, 0);
  }
}
</script>
<style lang="scss" src="./index.scss"></style>