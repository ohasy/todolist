import React, { useEffect, useState } from "react";
import from "web3/dist/web3.min.js";
const App = () => {
  const [account, setAccount] = useState(null);
  const [todoContract, setTodoContract] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState("");

  const loadContracts = async () => {

    const todoListJson = require("../build/contracts/TodoList.json");
    const todoListContract = TruffleContract(todoListJson);

    todoListContract.setProvider(window.web3.currentProvider);
    const todoList = await todoListContract.deployed();
    setTodoContract(todoList);
    // setTodoList(todoList);

    const taskCount = await todoList.taskCount();

    const tasksList = [];
    for (let i = 1; i <= taskCount; i++) {

      const task = await todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      tasksList.push({
        taskId,
        taskContent,
        taskCompleted
      })

    }
    setTasks(tasksList);
  };
  const createTask = async () => {
    await todoContract.createTask(newTaskContent, { from: account });
    window.location.reload()
  }

  const toggleCompleted = async (taskId) => {
    await todoContract.toggleCompleted(taskId, { from: account });
    window.location.reload()

  }

  useEffect(() => {
    window.web3 = new Web3(web3.currentProvider);
    window.ethereum.enable();
    web3.eth.requestAccounts().then((accounts) => {
      setAccount(accounts[0]);
      web3.eth.defaultAccount = accounts[0];
      loadContracts();
    });
  }, []);
  console.log(account);

  return (<div>
    <div>{account}</div>
    <input type="text" value={newTaskContent} onChange={(e) => setNewTaskContent(e.target.value)}></input>
    <button onClick={createTask}>Create Task</button>
    <br />
    <div>{tasks.map(task => (
      <div key={task.taskId}>
        <div>{task.taskContent}</div>
        <input type="checkbox" onChange={(e) => toggleCompleted(task.taskId)} checked={task.taskCompleted}></input>
      </div>
    ))}</div>

  </div>);
};

export default App;
