import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { PENCIL, ERASER } from "../constant/mode";
import { AppContext } from ".././context/App";

let canvas;

const DrawingboardContainer = forwardRef(function Drawingboard(props, ref) {
  const context = useContext(AppContext);
  const { selectedMode, setSelectedMode, brushSize, selectedColor } = context;
  const { onAddPath, onObjectRemove } = props;

  useEffect(() => {
    canvas = createCanvas();
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
    canvas.hoverCursor = `pointer`;
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
    }
    canvas.renderAll();
  }, [selectedMode]);

  const createCanvas = () => {
    const canvasConfig = {
      isDrawingMode: true,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "rgba(0,0,0,0)",
    };
    return new fabric.Canvas("c", canvasConfig);
  };

  const registerEvents = () => {
    canvas.on("path:created", (res) => {
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

  const addObject = (newObject) => {
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

const style = ({ selectedMode }) => `
    .canvas-box {
        display:inline-block;
        width:100vw;
        height:100vh;
        cursor: ${selectedMode ? "pointer" : "normal"};
    }
`;

export default DrawingboardContainer;
