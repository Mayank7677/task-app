import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsPlusLg } from "react-icons/bs";
import useListStore from "../store/useListStore";
import useTaskStore from "../store/useTaskStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { axiosInstance } from "../lib/axios";

const HomePage = () => {
  const [listOpen, setListOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [taskInput, setTaskInput] = useState({});

  const { allLists, createList, getAllLists } = useListStore();
  const { allTasks, createTask, getAllTasks, isLoading } = useTaskStore();

  useEffect(() => {
    getAllLists();
    getAllTasks();
  }, [getAllLists, getAllTasks]);

  const handleListToggle = () => setListOpen(!listOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listName) return;
    await createList(listName);
    setListName("");
    setListOpen(false);
  };

  const handleTasks = async (e, listId) => {
    e.preventDefault();
    const taskName = taskInput[listId] || "";
    if (!taskName) return;
    await createTask(taskName, listId);
    setTaskInput((prev) => ({ ...prev, [listId]: "" }));
    await getAllTasks();
  };

  // API call to move task to another list
  const moveTask = async (taskId, newListId) => {
    console.log("Moving task", taskId, "to list", newListId);
    try {
      await axiosInstance.put(`/tasks/moveTask/${taskId}`, { listId: newListId });
      await getAllTasks();
    } catch (error) {
      console.error("Error moving task", error);
    }
  };

  // Drag and drop handler
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // Only move if dropped in a different list
    if (destination.droppableId !== source.droppableId) {
      moveTask(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="mt-20 md:px-16 lg:px-20 xl:px-20 py-14">
        <div className="px-6 bg-neutral-800 py-3 border border-neutral-600 rounded-3xl w-fit flex items-center gap-2">
          {!listOpen ? (
            <div
              onClick={handleListToggle}
              className="flex items-center gap-2 cursor-pointer"
            >
              <p className="text-xl">
                <BsPlusLg />
              </p>
              <p>Create List</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="List Name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="border border-neutral-400 bg-neutral-900 outline-none px-2 rounded-xl py-2"
              />
              <div className="flex items-center gap-5">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600  px-3 py-1 cursor-pointer rounded-2xl flex items-center gap-1"
                >
                  <p className="text-xl">
                    <BsPlusLg />
                  </p>
                  Add
                </button>
                <button
                  onClick={handleListToggle}
                  className="bg-red-600  px-3 py-1 cursor-pointer rounded-2xl flex items-center gap-1"
                >
                  <RxCross1 />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lists mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {allLists.length > 0 ? (
            allLists.map((list) => (
              <Droppable droppableId={list._id} key={list._id}>
                {(provided) => (
                  <div
                    className="flex flex-col gap-10 border border-neutral-600 px-7 py-3"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <p className="text-xl font-serif tracking-tight">
                      {list.list}
                    </p>
                    {isLoading ? (
                      <p className="text-lg text-neutral-400">
                        Loading tasks...
                      </p>
                    ) : (
                      <div className="tasks flex flex-col gap-4">
                        {allTasks
                          .filter((task) => task?.listId?._id === list._id)
                          .map((task, idx) => (
                            <Draggable
                              draggableId={task._id}
                              index={idx}
                              key={task._id}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-neutral-700 px-4 py-2 rounded-lg"
                                >
                                  <p className="text-lg">{task.task}</p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}

                    <div className="flex items-end flex-1">
                      <div className="flex  gap-3">
                        <input
                          type="text"
                          placeholder="Task"
                          value={taskInput[list._id] || ""}
                          onChange={(e) =>
                            setTaskInput({
                              ...taskInput,
                              [list._id]: e.target.value,
                            })
                          }
                          className="border border-neutral-400 bg-neutral-900 outline-none px-2 rounded-xl py-2"
                        />
                        <div className="flex items-center gap-5">
                          <button
                            onClick={(e) => handleTasks(e, list._id)}
                            className="bg-blue-600  px-3 py-2 cursor-pointer rounded-2xl flex items-center gap-1"
                          >
                            <p className="text-xl">
                              <BsPlusLg />
                            </p>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            ))
          ) : (
            <p className=" text-lg text-neutral-400">
              No lists available. Please create a list.
            </p>
          )}
        </div>
      </section>
    </DragDropContext>
  );
};

export default HomePage;
