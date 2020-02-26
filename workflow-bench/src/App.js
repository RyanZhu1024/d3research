
import React from "react";
import './main.css';
import Nav from "./components/Nav";
import Workbench from "./components/Workbench";
import Console from "./components/Console";

class App extends React.Component {
  render() {
    return (
      <div className="flex flex-row bg-gray-200 h-screen">
        <Nav className="w-64 px-4 py-2 m-2" />
        <div className="flex flex-col px-4 py-2 m-2">
          <Workbench className="flex-1" />
          <Console className="h-64 justify-end" />
        </div>
      </div>
    )
  }
}

export default App;
