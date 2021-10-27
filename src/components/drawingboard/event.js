import { Eraser, Pan, Pencil, Select } from "../../constant/mode";
import { v4 as uuidv4 } from "uuid";
import { drawModes } from "../../constant/menu";
import {
  startDrawingShape,
  continueDrawingShape,
  endDrawingShape,
} from "../../service/canvas/shape";

let mousePressed, timeout;

export const registerCanvasEvents = ({
  canvas,
  sendObjectsToOthers,
  selectedMode,
  setCurrentZoom,
  setShowZoom,
  sendUpdatedValuesInCanvasToOthers,
  selectedFill,
  selectedStroke,
  brushSize,
  deleteObjectsFromOthers,
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
      startDrawingShape({
        option,
        canvas,
        shape: selectedMode,
        fill: selectedFill,
        stroke: selectedStroke,
        brushSize,
      });
    }
  });

  canvas.on("mouse:up", function () {
    mousePressed = false;
    if (isShapeDrawingMode) {
      const shapeObject = endDrawingShape({ canvas });
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
    } else if (option.target && selectedMode === Eraser) {
      option.target.set("opacity", 0.5);
      canvas.renderAll();
    }
  });

  canvas.on("mouse:out", function (option) {
    if (option.target && selectedMode === Eraser) {
      option.target.set("opacity", 1);
      canvas.renderAll();
    }
  });

  canvas.on("mouse:down", function (option) {
    if (option.target && selectedMode === Eraser) {
      canvas.remove(option.target);
      canvas.renderAll();
      deleteObjectsFromOthers([option.target.id]);
    }
  });

  canvas.on("mouse:move", function (option) {
    if (mousePressed) {
      if (selectedMode === Pan) {
        const mEvent = option.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
        canvas.relativePan(delta);
      } else if (isShapeDrawingMode) {
        continueDrawingShape({ canvas, option, shape: selectedMode });
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

  canvas.on("object:modified", (e) => {
    sendUpdatedValuesInCanvasToOthers();
  });

  return () => {
    document.onkeydown = null;
    canvas.__eventListeners = {};
  };
};

export const registerKeyEvents = ({ deleteSelectedObjects, window }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteSelectedObjects();
    }
  };

  window.onkeydown = handleKeyDown;

  return () => {
    window.onkeydown = null;
  };
};
