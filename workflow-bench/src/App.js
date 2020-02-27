
import React from "react";
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend'
import './main.css';
import Nav from "./components/Nav";
import Workbench from "./components/Workbench";
import Console from "./components/Console";

class App extends React.Component {
  render() {
    console.log('render app');
    return (
      <div className="flex flex-row bg-gray-200 h-screen">
        <DndProvider backend={Backend}>
          <Nav className="w-64 px-4 py-2 m-2 border border-blue-500" />
          <div className="flex flex-col px-4 py-2 flex-1">
            <Workbench className="flex-1 mb-2 border border-red-500" />
            <Console className="h-64 justify-end border border-green-500" />
          </div>
        </DndProvider>
      </div>
    )
  }
}

export default App;
