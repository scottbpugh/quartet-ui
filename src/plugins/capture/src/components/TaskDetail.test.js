import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import TaskDetail from "./TaskDetail";
it("returns taskDetail", () => {
  expect(TaskDetail).toMatchSnapshot();
});