import JctbTask from "../components/fit-comparison/JctbTask";
import TaskDetail from "../components/fit-comparison/TaskDetail";

export default {
  path: "/jctb-task",
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
};