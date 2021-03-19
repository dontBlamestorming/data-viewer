import React, { useState } from 'react';

import '../styles/Tools.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

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
      // active인 file을 클릭해서 드래그한다면?
      setCurrentIdx(result.destination.index);
    } else {
      // active된게 아닌 다른 file을 클릭해서 드래그한다면?

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
