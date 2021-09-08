import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle } from "react";

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
    console.log(newObject);
    fabric.util.enlivenObjects([newObject], (objects) => {
      objects.forEach((object) => {
        canvas.add(object);
      });
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
