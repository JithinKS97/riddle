import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { v4 as uuidv4 } from "uuid";

let canvas,
  canvasConfig = {
    isDrawingMode: true,
    width: 640,
    height: 360,
    backgroundColor: "rgba(0,0,0,0)",
  };

const Drawingboard = forwardRef((props, ref) => {
  const { onAddPath } = props;

  useEffect(() => {
    canvas = new fabric.Canvas("c", canvasConfig);
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
    registerEvents();
  }, []);

  const registerEvents = () => {
    canvas.on("path:created", (res) => {
      onAddPath(res.path);
    });
  };

  useImperativeHandle(ref, () => {
    return {
      getCanvasAsJSON,
      loadFromJSON,
      addObject,
    };
  });

  const getCanvasAsJSON = () => {
    return canvas.toJSON();
  };

  const loadFromJSON = (fabricJSON) => {
    canvas.loadFromJSON(fabricJSON);
  };

  const addObject = (newObject) => {
    fabric.util.enlivenObjects([newObject], (objects) => {
      objects.forEach((object) => {
        animatePath(object);
      });
    });
  };

  const animatePath = (pathObject) => {
    pathObject.opacity = 0;
    canvas.add(pathObject);
    fabric.util.animate({
      startValue: 0,
      endValue: 1,
      duration: 100,
      onChange: function (value) {
        pathObject.opacity = value;
        canvas.renderAll();
      },
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

const style = `
    .canvas-box {
        display:inline-block;
        border:1px solid black;
    }
`;

export default Drawingboard;
