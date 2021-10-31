import ContrastAnalysis from "@/components/contrast-analysis/ContrastAnalysis";
import JctbTask from "../components/fit-comparison/JctbTask";
import TaskDetail from "../components/fit-comparison/TaskDetail";
import StatisticReport from "@/components/statistic-report/StatisticReport";


export default {
  path: "/contrast-analysis",
  name: "contrast-analysis",
  component: ContrastAnalysis,
  children: [
    {
      path: "jctb-task",
      name: "jctb-task",
      component: JctbTask,
      children: [
        {
          path: "task-detail/:taskName",
          name: "task-detail",
          component: TaskDetail,
          props: true
        }
      ]
    },
    {
      path: "statistic-report",
      name: "statistic-report",
      component: StatisticReport
    }
  ]
};