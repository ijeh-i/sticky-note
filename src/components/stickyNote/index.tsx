import React, { useEffect, useRef, useState } from 'react';
import './index.css';

type PositionProps = { y: number; x: number };

type StickyNoteProps = {
  title: string;
  value: string;
  position: PositionProps;
  onClose: () => void;
  onUpdate: (value: string) => void;
  onClick: () => void;
  onPositionUpdate: (position: PositionProps) => void;
};

export const StickyNote = ({
  title,
  position,
  value,
  onClose,
  onUpdate,
  onClick,
  onPositionUpdate
}: StickyNoteProps): JSX.Element => {
  const stickyNoteRef = useRef() as any;
  const [allowMove, setAllowMove] = useState(false);
  const [differential, setDifferential] = useState({ dy: 0, dx: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAllowMove(true);
    const position = stickyNoteRef.current.getBoundingClientRect();
    setDifferential({
      dy: e.clientY - position.y,
      dx: e.clientX - position.x
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (allowMove) {
      // Move the Sticky note
      const newY = e.clientY - differential.dy;
      const newX = e.clientX - differential.dx;
      onPositionUpdate({ y: newY, x: newX });
    }
  };

  const handleMouseUp = () => {
    setAllowMove(false);
  };

  const handleTextUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;
    onUpdate(value);
  };

  useEffect(() => {}, []);

  return (
    <div
      className="sticky-container"
      ref={stickyNoteRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      style={{ top: position.y, left: position.x }}
    >
      <div className="sticky-header" onMouseDown={handleMouseDown}>
        <span className="sticky-title">{title}</span>
        <span className="sticky-close" onClick={onClose}>
          &times;
        </span>
      </div>
      <div className="sticky-textarea-container">
        <textarea className="sticky-textarea" value={value} onChange={(e) => handleTextUpdate(e)} />
      </div>
    </div>
  );
};
