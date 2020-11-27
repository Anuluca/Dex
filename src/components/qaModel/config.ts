export const modelParams = [
  {
    formInQuestion: {
      //发送的问题查询参数
      matchType: "fuzzy",
      keyword: "",
      locationLevels: "",
      phase: "",
      reportTime: "",
      qnaType: "",
    },
    url: "/bu/workflow/thinktank/getQuestions",
    formResult: {
      //发送的答案查询参数
      matchType: "fuzzy",
      question: "",
      keyword: "",
      locationLevels: "",
      phase: "",
      reportTime: "",
      qnaType: "",
    },
    resultUrl: "/bu/workflow/thinktank/getAnswers",
  },
  {
    formInQuestion: {
      //发送的风险查询参数
      matchType: "fuzzy",
      keyword: "",
      locationLevels: "",
      phase: "",
      reportTime: "",
      measureType: "",
    },
    url: "/bu/workflow/thinktank/getRisks",
    formResult: {
      //发送的答案查询参数
      matchType: "fuzzy",
      risk: "",
      keyword: "",
      locationLevels: "",
      phase: "",
      reportTime: "",
      measureType: "",
    },
    resultUrl: "/bu/workflow/thinktank/getMeasures",
  },
];
