import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { v4 as uuidv4 } from "uuid";

let canvas;

const Drawingboard = forwardRef((props, ref) => {
  const { onAddPath } = props;

  useEffect(() => {
    canvas = createCanvas();
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
    return registerEvents();
  }, []);

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
      onAddPath(res.path);
    });

    canvas.on("object:added", (res) => {
      res.target.set({
        id: uuidv4(),
      });
    });

    return () => {
      canvas.on("path:created", null);
      canvas.on("path:added", null);
    };
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
        width:100vw;
        height:100vh;
    }
`;

export default Drawingboard;
