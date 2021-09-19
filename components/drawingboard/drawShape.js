import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

let newShape, origX, origY;

export const startDrawingShape = ({
  canvas,
  option,
  shape,
  fill,
  stroke,
  brushSize,
}) => {
  const pointer = canvas.getPointer(option.e);
  origX = pointer.x;
  origY = pointer.y;

  switch (shape) {
    case "Rectangle":
      newShape = createNewRectangle({
        left: origX,
        top: origY,
        pointer,
        fill,
        stroke,
        strokeWidth: brushSize,
      });
  }
  newShape.set({
    id: uuidv4(),
    selectable: false,
    active: false,
    hoverCursor: "crosshair",
  });
  canvas.renderAll();
  canvas.add(newShape);
};

export const continueDrawingShape = ({ canvas, option }) => {
  const pointer = canvas.getPointer(option.e);

  if (origX > pointer.x) {
    newShape.set({ left: Math.abs(pointer.x) });
  }

  if (origY > pointer.y) {
    newShape.set({ top: Math.abs(pointer.y) });
  }

  newShape.set({ width: Math.abs(origX - pointer.x) });
  newShape.set({ height: Math.abs(origY - pointer.y) });

  newShape.setCoords();

  canvas.renderAll();
};

export const endDrawingShape = ({ canvas }) => {
  canvas.discardActiveObject();
  const shapeObject = newShape.toObject(["id"]);
  return shapeObject;
};

const createNewRectangle = ({
  left,
  top,
  pointer,
  fill,
  stroke,
  strokeWidth,
}) => {
  const newRectangle = new fabric.Rect({
    left,
    top,
    originX: "left",
    originY: "top",
    width: pointer.x - left,
    height: pointer.y - top,
    angle: 0,
    fill,
    stroke,
    transparentCorners: false,
    strokeWidth,
  });
  return newRectangle;
};
