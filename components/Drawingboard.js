import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { PENCIL, ERASER, PAN } from "../constant/mode";
import { AppContext } from ".././context/App";

let canvas, mousePressed;

const createCanvas = (window) => {
  const topBarClass = "css-198em1k";
  const canvasConfig = {
    isDrawingMode: true,
    width: window.innerWidth,
    height:
      window.innerHeight -
      document.getElementsByClassName(topBarClass)[0].offsetHeight,
    backgroundColor: "rgba(0,0,0,0)",
    selection: false,
  };
  return new fabric.Canvas("c", canvasConfig);
};

const DrawingboardContainer = forwardRef(function Drawingboard(props, ref) {
  const context = useContext(AppContext);
  const { selectedMode, brushSize, selectedColor } = context;
  const { onAddPath, onObjectRemove } = props;

  useEffect(() => {
    canvas = createCanvas(window);
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
  }, []);

  useEffect(() => {
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.renderAll();
  }, [selectedColor]);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    return registerEvents();
  }, [canvas, selectedMode]);

  useEffect(() => {
    canvas.freeDrawingBrush.width = brushSize;
    canvas.renderAll();
  }, [brushSize]);

  useEffect(() => {
    if (selectedMode === PENCIL) {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
      canvas.defaultCursor = "pointer";
      canvas.hoverCursor = "pointer";
    }
    if (selectedMode === PAN) {
      disableSelectForObjects();
      canvas.defaultCursor = "grab";
      canvas.hoverCursor = "grab";
    }
  }, [selectedMode]);

  const disableSelectForObjects = () => {
    canvas.getObjects().forEach((object) => {
      object.selectable = false;
    });
  };

  const registerEvents = () => {
    canvas.on("path:created", (res) => {
      console.log(res.path);
      res.path.set({
        id: uuidv4(),
      });
      onAddPath(res.path.toObject(["id"]));
    });

    canvas.on("mouse:down", function (options) {
      if (options.target && selectedMode === ERASER) {
        canvas.remove(options.target);
        canvas.renderAll();
      }
      mousePressed = true;
    });

    canvas.on("mouse:up", function () {
      mousePressed = false;
    });

    canvas.on("mouse:over", function (options) {
      if (options.target && selectedMode === ERASER) {
        options.target.set("opacity", 0.5);
        canvas.renderAll();
      }
    });

    canvas.on("mouse:out", function (options) {
      if (options.target && selectedMode === ERASER) {
        options.target.set("opacity", 1);
        canvas.renderAll();
      }
    });

    canvas.on("object:removed", function (options) {
      onObjectRemove(options.target.id);
    });

    canvas.on("mouse:move", function (event) {
      if (mousePressed && selectedMode === PAN) {
        const mEvent = event.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
        canvas.relativePan(delta);
      }
    });

    canvas.on("mouse:wheel", function (option) {
      var delta = option.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
      option.e.preventDefault();
      option.e.stopPropagation();
    });

    return () => {
      canvas.__eventListeners = {};
    };
  };

  useImperativeHandle(ref, () => {
    return {
      getCanvasAsJSON,
      loadFromJSON,
      addObject,
      removeObject,
    };
  });

  const removeObject = (id) => {
    if (!id) {
      return;
    }
    canvas.getObjects().forEach((object) => {
      if (object.id === id) {
        animatePath(object, 1, 0, () => {
          canvas.remove(object);
        });
        canvas.renderAll();
      }
    });
  };

  const getCanvasAsJSON = () => {
    return canvas.toJSON(["id"]);
  };

  const loadFromJSON = (fabricJSON) => {
    canvas.loadFromJSON(fabricJSON);
  };

  const addObject = (newObject, nameOfTheAdder) => {
    fabric.util.enlivenObjects([newObject], (objects) => {
      objects.forEach((object) => {
        canvas.add(object);
        animatePath(object, 0, 1);
      });
    });
  };

  const animatePath = (pathObject, startValue, endValue, onComplete) => {
    fabric.util.animate({
      startValue,
      endValue,
      duration: 150,
      onChange: function (value) {
        pathObject.opacity = value;
        canvas.renderAll();
      },
      onComplete,
    });
  };

  return (
    <>
      <style>{style}</style>
      <div className="canvas-box">
        <canvas id="c"></canvas>
      </div>
    </>
  );
});

const style = ({}) => `
    .canvas-box {
        display:inline-block;
    }
`;

export default DrawingboardContainer;
