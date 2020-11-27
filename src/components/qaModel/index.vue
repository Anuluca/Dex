<template src = "./index.html"></template>
<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { questionData, answerData } from "./mock";
// import ReviewPreview from "@/components/reviewPreview/index.vue";
// import QaTable from "@/components/qaTable/index.vue";
// import {
//   getInitInfo,
//   getResultInfo,
//   // transformResult,
//   // recoverResult,
// } from "./api"; //引入接口
import { modelParams } from "./config";

@Component({
  //注册组件
  //   components: {
  //     "review-preview": ReviewPreview,
  //     qatable: QaTable,
  //   },
})
export default class Qa extends Vue {
  //data
  @Prop({ default: () => [] }) readonly deliverData!: any[]; //父组件传来的答案列表
  @Prop({ default: () => "qaMode" }) readonly selectQaMode!: string; //父组件传来的答案列表
  activeName: any = "first"; //当前标签页
  qaPhase: any = [1, 2, 3]; //项目阶段
  questionNow: any = ""; //当前question值
  riskNow: any = ""; //当前risk值
  scrolltop: any = ""; //当前问题查询框的滚动条高度值
  optionQuestion = true; //问题页公共标签显示
  optionAnswer = true; //答案页公共标签显示
  showColumns: any = questionData; //问题查询结果
  resultColumns: any = []; //答案查询结果
  // questionCount: any = "..."; //问题结果数量
  // answerCount: any = "..."; //答案结果数量
  questionLoading = false; //问题页加载遮罩层
  answerLoading = false; //答案页加载遮罩层
  nowSelection: any = []; //已选多选框列表
  resultChoseList: any = []; //已选答案列表（去重后）
  selectTempList: any = []; //已选答案列表
  nowSelectRow: any = {}; //当前选择问题
  stickDiv: any = "stickDiv";
  stickDivChose: any = -1; //导航栏对应答案被选择后的样式
  stickDivClick: any = 0; //导航栏点击后样式
  stickDivBacked: any = -1; //导航栏对应答案被备选后的样式
  answerRowShow: any = -1; //备选答案样式
  displayNone = false; //备选答案以外其他答案样式
  reserveAnswers: any = []; //备选答案
  lazy: any = true; //区域层级动态加载
  resultChoseDrawer = false; //答案预览界面展示
  choseResultArr: any = []; //选中对应的pdf
  tableHeight: any = window.innerHeight - 295; //问题结果高度
  resultHeight: any = window.innerHeight - 275; //答案结果高度
  pdfHeight: any = window.innerHeight / 2; //pdf高度
  nowColumn: any = ""; //预览界面中操作的列
  selectModule = 0;
  ifSticked = false; //只看已钉
  stickedCss: any = -1; //已钉样式
  areaTempList: any = [];
  showChecked = false;
  resultChecked = false;
  questionData = questionData;
  answerData = answerData;
  pickerOptions: any = [
    new Date().getFullYear() - 4,
    new Date().getFullYear() - 3,
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
  ];
  resultForm: any = {
    //答案表单
    input: "",
    value1: "",
    value1show: "",
    value2: "",
    value3: "",
    value4: false,
  };
  showForm: any = {
    //第一个页面表单信息
    input: "",
    // checked: "",
    value1: "",
    value1show: "",
    value2: "",
    value3: "",
    value4: false,
  };
  formInQuestion: any = {};
  formInAnswer: any = {};

  created() {
    this.changeSelectMode();
  }
  changeShowArea(value: any) {
    this.showForm.value1show = value;
  }
  changeResultArea(value: any) {
    this.resultForm.value1show = value;
  }
  changeSelectMode() {
    switch (this.selectQaMode) {
      case "qaMode":
        this.selectModule = 0;
        break;
      case "riskMeasure":
        this.selectModule = 1;
        break;
    }
  }

  //页面加载完自动查询
  mounted() {
    this.initTable();
  }

  //更新查询结果数量
  get selectCount() {
    return this.showColumns.length;
  }

  get resultCount() {
    return this.resultColumns.length;
  }

  //初始化问题列表
  initTable() {
    this.formInQuestion = modelParams[this.selectModule].formInQuestion;
    this.showColumns = this.questionData;
  }

  //查询问题
  questionSearch() {
    this.formInQuestion = modelParams[this.selectModule].formInQuestion;
    this.formInQuestion.keywords = this.showForm.input.toUpperCase();
    if (this.showChecked == true) {
      //是否选择公共标签查询
      this.formInQuestion.matchType = "precise";
      this.formInQuestion.locationLevels = this.showForm.value1show || "";
      this.formInQuestion.phase = this.showForm.value2 || "";
      this.formInQuestion.reportTime = this.showForm.value3 || "";
      if (this.selectModule == 0) {
        this.formInQuestion.qnaType =
          this.showForm.value4 != false ? "common" : "";
      } else {
        this.formInQuestion.measureType =
          this.showForm.value4 != false ? "common" : "";
      }
    } else {
      this.formInQuestion.matchType = "fuzzy";
    }
    // this.sendPost_question(this.formInQuestion); //向后端发送请求
    this.showColumns = this.questionData;
    (this.$refs.scroll as any).bodyWrapper.scrollTop = 0;
  }

  //查询答案
  answerSearch() {
    const formResult = modelParams[this.selectModule].formResult;
    this.formInQuestion.keywords = this.showForm.input.toUpperCase();
    if (this.selectModule == 0) {
      formResult.question = this.questionNow;
    } else {
      formResult.risk = this.riskNow;
    }
    if (this.resultChecked == true) {
      //是否选择公共标签查询
      formResult.matchType = "precise";
      formResult.locationLevels = this.resultForm.value1show || "";
      formResult.phase = this.resultForm.value2 || "";
      formResult.reportTime = this.resultForm.value3 || "";
      if (this.selectModule == 0) {
        formResult.qnaType = this.resultForm.value4 != false ? "common" : "";
      } else {
        formResult.measureType =
          this.resultForm.value4 != false ? "common" : "";
      }
    } else {
      formResult.matchType = "fuzzy";
    }
    this.resultColumns = this.answerData;
  }

  //填入父组件传来的数据
  getFatherData() {
    this.activeName = "first";
    console.log("填入父组件传来的数据");
    console.log(this.deliverData);
    this.selectTempList = JSON.parse(JSON.stringify(this.deliverData));
    (this.$refs.scroll as any).clearSelection();
    this.getChoseQuestionData();
    //更新length
    this.nowSelection = this.selectTempList;
    this.removeCurRow();
  }

  //向父组件返回选择的答案
  @Emit("sendData")
  ctSendData() {
    //结果集去重
    console.log("answers>>", this.selectTempList);
    return this.selectTempList;
  }

  //多选框选择事件
  handleSelectionChange(selection: any, row: any) {
    console.log(selection);
    //获取选择的数组长度，传入添加按钮标记
    if ((selection.length && selection.indexOf(row) !== -1) == true) {
      //触发handdle事件
      const _row = selection[selection.length - 1];
      this.handdle(_row, "", "");
    } else {
      //取消
      this.selectTempList.forEach((i: any) => {
        if (i.value == row.value) {
          this.selectTempList.splice(this.selectTempList.indexOf(i), 1);
        }
      });
      this.nowSelection = selection;
    }
  }

  //单选框选择事件
  handleCurrentChange(val: any, index: any) {
    //修改导航栏对应div样式
    if (this.selectModule == 0) {
      this.stickDivChose = index;
    }

    if (val) {
      //返回问题页
      this.activeName = "first";
      //勾上对应问题
      (this.$refs.scroll as any).toggleRowSelection(this.nowSelectRow, true);
      this.nowSelection = this.selectTempList;
      //如果当前答案的问题在结果集里已经有了，删除当前选择的答案以外的同一个问题的对应答案
      this.selectTempList.forEach((i: any) => {
        if (i.value == val.value) {
          this.selectTempList.splice(this.selectTempList.indexOf(i), 1);
        }
      });
      //将已选答案存入数组
      this.selectTempList.push(val);
      this.setScrollCoor();
    }
  }

  //备选按钮点击事件
  addReserve(val: any, index: any) {
    //修改导航栏对应div样式
    if (this.reserveAnswers.indexOf(index) > -1) {
      this.reserveAnswers.forEach((i: any) => {
        if (i == index) {
          this.reserveAnswers.splice(this.reserveAnswers.indexOf(i), 1);
        }
      });
    } else {
      this.reserveAnswers.push(index);
    }
  }

  rowShow({ row, rowIndex }: any) {
    return {
      answerRowShow: this.reserveAnswers.indexOf(rowIndex) > -1,
      displayNone:
        this.reserveAnswers.indexOf(rowIndex) == -1 && this.displayNone,
    };
  }

  //-----------------界面交互-----------------------
  //切换是否使用tag查询
  changeSearchWay(item: any) {
    this.showChecked == true
      ? (this.optionQuestion = false)
      : (this.optionQuestion = true);
    this.resultChecked == true
      ? (this.optionAnswer = false)
      : (this.optionAnswer = true);
    item == 1 ? this.questionSearch() : this.answerSearch();
  }

  //重置表单
  resetForm(formName: any) {
    this.showForm = {
      input: "",
      value1: "",
      value1show: "",
      value2: "",
      value3: "",
      value4: false,
    };
    this.resultForm = {
      input: "",
      value1: "",
      value1show: "",
      value2: "",
      value3: "",
      value4: false,
    };
  }

  //切换到答案页
  handdle(row: any, event: any, column: any) {
    this.nowColumn = row;
    this.answerLoading = true;
    if (row) {
      if (this.selectModule == 0) {
        //查询对应答案
        this.questionNow = row.value;
        this.resultColumns = this.answerData;
        this.reserveAnswers = [];
        this.stickDivChose = -1;
        this.stickDivBacked = -1;
        this.answerRowShow = -1;
      } else {
        this.riskNow = row.value;
        this.resultColumns = this.answerData;
      }
      this.nowSelectRow = row;
      this.activeName = "second";
      this.scrolltop = (this.$refs.scroll as any).bodyWrapper.scrollTop;
    }
    this.answerLoading = false;
  }

  //只显示已钉
  stick() {
    if (this.ifSticked == true) {
      this.displayNone = true;
    } else {
      this.displayNone = false;
    }
  }

  removeCurRow() {
    this.activeName = "first";
    console.log(this.choseResultArr);

    if (this.choseResultArr.length == 0) {
      (this.$refs.scroll as any).toggleRowSelection(this.nowColumn, false);
    }
  }

  //单选框显示级联选择器选择的最后一项
  handleItemChangeQuestion(e: any) {
    this.showForm.value1show = e[e.length - 1];
  }
  handleItemChangeAnswer(e: any) {
    this.resultForm.value1show = e[e.length - 1];
  }

  //填入已选择的问题
  getChoseQuestionData() {
    setTimeout(() => {
      if (this.selectTempList != []) {
        this.selectTempList.forEach((i: any) => {
          const questionArray = this.showColumns.map((v: any) => v.value);
          const index = questionArray.indexOf(i.value);
          (this.$refs.scroll as any).toggleRowSelection(
            this.showColumns[index],
            true
          );
        });
      }
    }, 0);
  }

  //填入已选择的答案
  getChoseAnswerData(formInAnswer: any) {
    this.choseResultArr = [];
    this.stickDivClick = 0;
    setTimeout(() => {
      if (this.selectModule == 0) {
        this.selectTempList.forEach((i: any) => {
          this.resultColumns.forEach((j: any, index: any) => {
            if (i && i.result_text == j.result_text && i.value == j.value) {
              this.choseResultArr = [index];
            }
          });
          const questionArray = this.selectTempList.map(function (v: any) {
            return v.value;
          });
          if (questionArray.indexOf(this.questionNow) >= 0) {
            setTimeout(() => {
              this.stickDivChose = this.choseResultArr[0];
            }, 0);
          }
        });
      } else {
        this.selectTempList.forEach((i: any) => {
          this.resultColumns.forEach((j: any, index: any) => {
            if (i && i.result_text == j.result_text && i.value == j.value) {
              this.choseResultArr = [index];
            }
          });
        });
      }
    }, 0);
  }

  //返回问题页滚动条回正
  setScrollCoor() {
    setTimeout(() => {
      (this.$refs.scroll as any).bodyWrapper.scrollTop = this.scrolltop;
    }, 0);
  }

  //点击预览已选问答
  previewChose() {
    console.log("---------点击预览已选问答----------");
    this.resultChoseDrawer = true;
  }

  //导航栏跳转到对应答案
  jumpToAnswer(row: any) {
    this.stickDivClick = row;
    document.querySelectorAll(".stickDiv")[row].classList.add("stickDivClick");
    setTimeout(() => {
      (this.$refs["tableScrollListener"] as any).bodyWrapper.scrollTop =
        (this.pdfHeight+20) * row;
    }, 0);
  }

  //删除行
  deleteRow(arr: any) {
    arr.splice(arr[0], 1);
    (this.$refs.scroll as any).clearSelection();
    setTimeout(() => {
      this.selectTempList.forEach((i: any) => {
        const questionArray = this.showColumns.map(function (v: any) {
          return v.value;
        });
        const index = questionArray.indexOf(i.value);
        (this.$refs.scroll as any).toggleRowSelection(
          this.showColumns[index],
          true
        );
      });
    }, 0);
    //更新length
    this.nowSelection = (this.$refs.scroll as any).selection;
  }

  //   //-----------------接口调用----------------
  //   //请求问题数据
  //   async sendPost_question(formInQuestion) {
  //     this.questionLoading = true;
  //     let flag = false;
  //     let resultCo = [];
  //     try {
  //       resultCo = await getInitInfo(
  //         modelParams[this.selectModule].url,
  //         formInQuestion
  //       );
  //       console.log("请求接口调用--------");
  //       resultCo = this.transformValue(resultCo);
  //       console.log("请求问题替换结果------");
  //       console.log(resultCo);
  //       this.showColumns = this.removeRepetition(resultCo);
  //       this.questionLoading = false;
  //       this.getChoseQuestionData();
  //     } catch {
  //       this.$message({
  //         message: "后台请求接口失败",
  //         type: "error",
  //       });
  //     }
  //   }

  //   //请求答案数据
  //   async sendPost_answer(formInAnswer) {
  //     this.answerLoading = true;
  //     try {
  //       this.resultColumns = await getResultInfo(
  //         modelParams[this.selectModule].resultUrl,
  //         formInAnswer
  //       );
  //       console.log("------请求答案数据-----------");
  //       console.log(this.resultColumns);
  //       // this.resultColumns = transformResult(
  //       //   this.selectModule == 0,
  //       //   this.resultColumns
  //       // );
  //       this.getChoseAnswerData(formInAnswer);
  //       this.answerLoading = false;
  //     } catch {
  //       this.$message({
  //         message: "后台请求接口失败",
  //         type: "error",
  //       });
  //     }
  //   }

  //去重函数
  removeRepetition(resultCo: any) {
    const obj: any = {};
    let result = "";
    result = resultCo.reduce((preVal: any, curVal: any) => {
      obj[curVal.value] ? "" : (obj[curVal.value] = preVal.push(curVal));
      return preVal;
    }, []);
    return result;
  }
}
</script>

<style lang="scss" src = "./index.scss"></style>