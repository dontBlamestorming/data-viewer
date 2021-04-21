import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/*
  Add하기로 결정하면 사용할 코드
    1. 현재는 하나의 사진을 볼 수 있지만, 여러개의 사진만을 select하여서 보고싶은 경우
    2. selected된 사진의 순서를 바꾸고 싶은 경우(Drag and Drop)
*/

function Tools({ activeFiles, setActiveFiles, currentIdx, setCurrentIdx }) {
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const files = reorder(
      activeFiles,
      result.source.index,
      result.destination.index,
    );

    setActiveFiles(files);
    if (result.source.index === currentIdx) {
      setCurrentIdx(result.destination.index);
    } else {
      if (result.source.index < currentIdx) {
        setCurrentIdx(currentIdx - 1);
      } else if (result.source.index > currentIdx) {
        setCurrentIdx(currentIdx + 1);
      }
    }
  };

  return (
    <>
      <h1>History</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              className="content"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {activeFiles.map((file, index) => (
                <File
                  file={file}
                  index={index}
                  key={file.path}
                  currentIdx={currentIdx}
                  setCurrentIdx={setCurrentIdx}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

const File = ({ file, index, currentIdx, setCurrentIdx }) => {
  return (
    <Draggable draggableId={file.path} index={index}>
      {(provided) => (
        <div
          className={`path ${currentIdx === index && 'active'}`}
          onClick={() => setCurrentIdx(index)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {file.path}
        </div>
      )}
    </Draggable>
  );
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default Tools;
