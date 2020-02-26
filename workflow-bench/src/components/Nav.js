import React from 'react';

const Nav = ({ className }) => {
  return (
    <div className={className}>
      <h1 className="text-2xl">Choose a snap</h1>
      <div className="grid grid-rows-5 grid-flow-col gap-4">
        <div>
          Snap1
        </div>
        <div>
          Snap2
        </div>
        <div>
          Snap3
        </div>
        <div>
          Snap4
        </div>
        <div>
          Snap5
        </div>
      </div>
    </div>
  )
}

export default Nav
