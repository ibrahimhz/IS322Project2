import {useEffect, useState} from 'react';
import './App.css';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

function App() {
  const [state, setState] = useState(null);

  useEffect(() => {
    fetch("http://my-json-server.typicode.com/bnissen24/project2DB/posts", {
      method: "GET",
      headers: new Headers({
        Accept: "application/json"
      })
    })
        .then(response => response.json())
        .then(data => {
          let result = {};
          data.map((item) => {
            if (!result.hasOwnProperty(item.column)) {
              result[item.column] = {
                title: item.column,
                items: []
              }
            }
            result[item.column].items.push({id: item.id.toString(), title: item.title})
          });

          setState(result);
        })
  }, [])

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }
    const itemCopy = {...state[source.droppableId].items[source.index]}

    setState(prev => {
      prev = {...prev}
      prev[source.droppableId].items.splice(source.index, 1)
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const order_of_columns = ['todo', 'in-progress', 'review', 'done'];





  return (
      <div className="App">
        <DragDropContext onDragEnd={handleDragEnd}>
          {order_of_columns.map((key) => {
            if (state) {
              let data = state[key];
              return (
                  <div key={key} className={"column"}>
                    <h3>{data.title}</h3>
                    <Droppable droppableId={key}>
                      {(provided, snapshot) => {
                        return (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={"droppable-col"}
                            >
                              {data.items.map((element, index) => {
                                console.log(element);
                                return (
                                    <Draggable key={element.id} index={index} draggableId={element.id}>
                                      {(provided, snapshot) => {
                                        console.log(snapshot)
                                        return (
                                            <div
                                                className={`item ${snapshot.isDragging && "dragging"}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                              {element.title}
                                            </div>
                                        )
                                      }}
                                    </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                        )
                      }}
                    </Droppable>
                  </div>
              )
            } else {
              return null;
            }
          })}
        </DragDropContext>
      </div>
  );
}

export default App;
