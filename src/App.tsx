import React, { useEffect, useState } from 'react';
import './App.css';

import { StickyNote } from './components/stickyNote';

type PositonProps = {
  y: number;
  x: number;
};

type StickyNoteProps = {
  id: string;
  title: string;
  value: string;
  position: PositonProps;
};

let debouncer: NodeJS.Timeout;
let STORE_KEY = 'sticky-list';

function App() {
  const [stickyList, setStickyList] = useState<StickyNoteProps[]>([]);
  const [counter, setCounter] = useState<number>(1);

  const handleRemoveNote = (noteId: string) =>
    setStickyList((prev) => prev.filter((item) => item.id !== noteId));

  const handleAddNote = () => {
    setStickyList((prev) => [
      ...prev,
      {
        id: new Date().toISOString(), // Unique string generated for id.
        title: `Sticky Note ${counter}`,
        value: '',
        position: {
          y: 10 + (counter - 1) * 5,
          x: 60 + (counter - 1) * 5
        }
      }
    ]);
    setCounter((prev) => prev + 1);
  };

  const handleNoteUpdate = (value: string, index: number) => {
    let newList = [...stickyList];
    newList[index].value = value;
    setStickyList(newList);
  };

  const handlePositonUpdate = (position: PositonProps, noteId: string) => {
    const noteIndex = stickyList.findIndex((item) => item.id === noteId);
    if (noteIndex > -1) {
      let newList = [...stickyList];
      newList[noteIndex].position = position;
      setStickyList(newList);
    }
  };

  const updateIndex = (index: number) => {
    // Handles moving the clicked note to the front of any note overlapping it.
    let newList = [...stickyList];
    const listLength = newList.length;
    if (index + 1 !== listLength) {
      const content = newList.splice(index, 1);
      newList.push(content[0]);
      setStickyList(newList);
    }
  };

  const onSaveData = (data: StickyNoteProps[]) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
      clearTimeout(debouncer);

      // onPostAPI(data) // Dummy API call to post data after saving
    } catch (err) {
      // Function to handle error goes here.
    }
  };

  // const onPostAPI = async (data: StickyNoteProps[]) => {
  //   try {
  //     const init = {
  //       method: 'POST',
  //       body: JSON.stringify(data)
  //     };
  //     const response = await fetch(`https:dummy.dummy.com/notes`, init);
  //   } catch (err) {
  //     // Function to handle error goes here
  //   }
  // };

  // const onFetchAPI = async () => {
  //   try {
  //     const init = {
  //       method: 'GET'
  //     };
  //     const response = await fetch(`https:dummy.dummy.com/notes`, init);
  //     // Use response from API to update the state list.
  //   } catch (err) {
  //     // Function to handle error goes here
  //   }
  // };

  useEffect(() => {
    try {
      // Fetch previous data from localstorage or API, then update the current store.
      const prevData = localStorage.getItem(STORE_KEY);
      if (prevData) {
        setStickyList(JSON.parse(prevData));
      }

      // onFetchAPI(); //  Dummy API call to fetch data from API
    } catch (err) {
      // Function to handle error goes here.
    }
  }, []);

  useEffect(() => {
    // Auto save of notes and content after 3 seconds.
    clearTimeout(debouncer); // Cancel previous save action in the even t of an update within 3 seconds.
    debouncer = setTimeout(() => onSaveData(stickyList), 3000);
  }, [stickyList]);

  return (
    <div>
      <button title="Add a new Note" className="sticky-btn sticky-add-btn" onClick={handleAddNote}>
        <span className="sticky-btn-icon">+</span>
      </button>
      <button
        title="Clear all Notes"
        className="sticky-btn sticky-delete-btn"
        onClick={() => setStickyList([])}
      >
        <span className="sticky-btn-icon">&times;</span>
      </button>
      {stickyList.map((item, index) => (
        <StickyNote
          key={item.id}
          title={item.title}
          value={item.value}
          position={item.position}
          onUpdate={(value: string) => handleNoteUpdate(value, index)}
          onClose={() => handleRemoveNote(item.id)}
          onClick={() => updateIndex(index)}
          onPositionUpdate={(position: PositonProps) => handlePositonUpdate(position, item.id)}
        />
      ))}
    </div>
  );
}

export default App;
