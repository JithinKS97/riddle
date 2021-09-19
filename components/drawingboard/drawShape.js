import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { Rectangle, Line, Ellipse } from "../../constant/mode";

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
    case Rectangle:
      newShape = createNewRectangle({
        left: origX,
        top: origY,
        pointer,
        fill,
        stroke,
        strokeWidth: brushSize,
      });
      break;
    case Line:
      newShape = createNewLine({
        coords: [origX, origY, origX, origY],
        stroke,
        strokeWidth: brushSize,
      });
      break;
    case Ellipse:
      newShape = createNewEllipse({
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

export const continueDrawingShape = ({ canvas, option, shape }) => {
  const pointer = canvas.getPointer(option.e);
  switch (shape) {
    case Rectangle:
      if (origX > pointer.x) {
        newShape.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        newShape.set({ top: Math.abs(pointer.y) });
      }
      newShape.set({ width: Math.abs(origX - pointer.x) });
      newShape.set({ height: Math.abs(origY - pointer.y) });
      break;
    case Line:
      newShape.set({
        x1: origX,
        y1: origY,
        x2: pointer.x,
        y2: pointer.y,
      });

      break;
    case Ellipse:
      if (origX > pointer.x) {
        newShape.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        newShape.set({ top: Math.abs(pointer.y) });
      }
      newShape.set({ rx: Math.abs(origX - pointer.x) / 2 });
      newShape.set({ ry: Math.abs(origY - pointer.y) / 2 });
      break;
  }
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

const createNewLine = ({ coords, stroke, strokeWidth }) => {
  const newLine = new fabric.Line(coords, {
    stroke,
    strokeWidth,
  });
  return newLine;
};

const createNewEllipse = ({
  left,
  top,
  pointer,
  fill,
  stroke,
  strokeWidth,
}) => {
  const newEllipse = new fabric.Ellipse({
    left,
    top,
    originX: "left",
    originY: "top",
    rx: (pointer.x - left) / 2,
    ry: (pointer.y - top) / 2,
    angle: 0,
    fill,
    stroke,
    strokeWidth,
  });
  return newEllipse;
};
