import { Pan, Eraser } from "../../constant/mode";
import { v4 as uuidv4 } from "uuid";

let mousePressed, timeout;

export const registerCanvasEvents = ({
  canvas,
  sendObjectsToOthers,
  selectedMode,
  setCurrentZoom,
  setShowZoom,
  sendSelectedObjectsToOthers,
}) => {
  canvas.on("path:created", (res) => {
    res.path.set({
      id: uuidv4(),
    });
    const newObject = res.path.toObject(["id"]);
    sendObjectsToOthers([newObject]);
  });

  canvas.on("mouse:down", function (options) {
    if (options.target && selectedMode === Eraser) {
      canvas.remove(options.target);
      canvas.renderAll();
    }
    mousePressed = true;
  });

  canvas.on("mouse:up", function () {
    mousePressed = false;
  });

  canvas.on("mouse:over", function (options) {
    if (options.target && selectedMode === Eraser) {
      options.target.set("opacity", 0.5);
      canvas.renderAll();
    }
  });

  canvas.on("mouse:out", function (options) {
    if (options.target && selectedMode === Eraser) {
      options.target.set("opacity", 1);
      canvas.renderAll();
    }
  });

  canvas.on("mouse:move", function (event) {
    if (mousePressed && selectedMode === Pan) {
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
      canvas.relativePan(delta);
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
    console.log("Hello");
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteSelectedObjects();
    }
  };

  document.onkeydown = handleKeyDown;

  return () => {
    document.onkeydown = null;
  };
};
