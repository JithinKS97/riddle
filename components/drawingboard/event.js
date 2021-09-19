import { Pan, Pencil, Select } from "../../constant/mode";
import { v4 as uuidv4 } from "uuid";
import { drawModes } from "../../constant/menu";
import {
  startDrawingShape,
  continueDrawingShape,
  endDrawingShape,
} from "./drawShape";

let mousePressed, timeout;

export const registerCanvasEvents = ({
  canvas,
  sendObjectsToOthers,
  selectedMode,
  setCurrentZoom,
  setShowZoom,
  sendSelectedObjectsToOthers,
}) => {
  const isShapeDrawingMode =
    drawModes.includes(selectedMode) && selectedMode !== Pencil;

  canvas.on("path:created", (res) => {
    res.path.set({
      id: uuidv4(),
    });
    const newObject = res.path.toObject(["id"]);
    sendObjectsToOthers([newObject]);
  });

  canvas.on("mouse:down", function (option) {
    mousePressed = true;
    if (isShapeDrawingMode) {
      canvas.isDrawingMode = false;
      startDrawingShape({ option, canvas, selectedMode });
    }
  });

  canvas.on("mouse:up", function () {
    mousePressed = false;
    if (isShapeDrawingMode) {
      canvas.discardActiveObject();
      const shapeObject = endDrawingShape();
      if (shapeObject) {
        sendObjectsToOthers([shapeObject]);
      }
    }
  });

  canvas.on("mouse:over", function (option) {
    if (selectedMode === Select) {
      if (option.target) {
        option.target.set({
          hoverCursor: "move",
        });
      }
    }
  });

  canvas.on("mouse:move", function (option) {
    if (mousePressed) {
      if (selectedMode === Pan) {
        const mEvent = option.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
        canvas.relativePan(delta);
      } else if (isShapeDrawingMode) {
        continueDrawingShape({ canvas, option });
      }
    }
  });

  canvas.on("mouse:wheel", function (option) {
    setShowZoom(true);
    const delta = option.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
    option.e.preventDefault();
    option.e.stopPropagation();
    setCurrentZoom(zoom);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setShowZoom(false);
    }, 1000);
  });

  canvas.on("object:modified", () => {
    sendSelectedObjectsToOthers();
  });

  return () => {
    document.onkeydown = null;
    canvas.__eventListeners = {};
  };
};

export const registerKeyEvents = ({ deleteSelectedObjects, document }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteSelectedObjects();
    }
  };

  document.onkeydown = handleKeyDown;

  return () => {
    document.onkeydown = null;
  };
};
