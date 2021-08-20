import FitComparison from "../components/fit-comparison/FitComparison";
import TaskDetail from "../components/fit-comparison/TaskDetail";

export default {
  path: "/fit-comparison",
  name: "fit-comparison",
  component: FitComparison,
  children: [
    {
      path: "task-detail/:taskName",
      name: "task-detail",
      component: TaskDetail,
      props: true
    }
  ]
};