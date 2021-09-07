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
  useEffect(() => {
    canvas = new fabric.Canvas("c", canvasConfig);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getCanvasAsJSON,
      loadFromJSON,
    };
  });

  const getCanvasAsJSON = () => {
    return canvas.toJSON();
  };

  const loadFromJSON = (fabricJSON) => {
    canvas.loadFromJSON(fabricJSON);
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
