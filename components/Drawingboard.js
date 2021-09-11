import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { v4 as uuidv4 } from "uuid";
import { PENCIL, ERASER } from "../constant/mode";

let canvas;

const DrawingboardContainer = forwardRef(function Drawingboard(props, ref) {
  const { onAddPath, onObjectRemove, selectedTool } = props;

  useEffect(() => {
    canvas = createCanvas();
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
    canvas.hoverCursor = `pointer`;
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    return registerEvents();
  }, [canvas, selectedTool]);

  useEffect(() => {
    if (selectedTool === PENCIL) {
      canvas.isDrawingMode = true;
      canvas.renderAll();
    } else {
      canvas.isDrawingMode = false;
      canvas.renderAll();
    }
  }, [selectedTool]);

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
      if (options.target && selectedTool === ERASER) {
        canvas.remove(options.target);
        canvas.renderAll();
      }
    });

    canvas.on("mouse:over", function (options) {
      if (options.target && selectedTool === ERASER) {
        options.target.set("opacity", 0.5);
        canvas.renderAll();
      }
    });

    canvas.on("mouse:out", function (options) {
      if (options.target && selectedTool === ERASER) {
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

const style = ({ selectedTool }) => `
    .canvas-box {
        display:inline-block;
        width:100vw;
        height:100vh;
        cursor: ${selectedTool ? "pointer" : "normal"};
    }
`;

export default DrawingboardContainer;
