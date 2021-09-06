import { fabric } from "fabric";
import { useEffect } from "react";

let canvas,
  canvasConfig = {
    isDrawingMode: true,
    width: 640,
    height: 360,
    backgroundColor: "rgba(0,0,0,0)",
  };

function Drawingboard() {
  useEffect(() => {
    canvas = new fabric.Canvas("c", canvasConfig);
  }, []);

  return (
    <>
      <style>{style}</style>
      <div className="canvas-box">
        <canvas id="c"></canvas>
      </div>
    </>
  );
}

const style = `
    .canvas-box {
        display:inline-block;
        border:1px solid black;
    }
`;

export default Drawingboard;
