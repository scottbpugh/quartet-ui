import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import TasksList from "./TasksList";

it("returns the right TasksList view", () => {
  expect(TasksList).toMatchSnapshot();
});