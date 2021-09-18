import { fabric } from "fabric";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import { AppContext } from "../../context/App";
import { onModeChange } from "./mode";

let canvas;

fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

import {
  changePropertyOfSelectedObjectsInCanvas,
  deleteSelectedObjectsInCanvas,
  getSelectedObjectsInCanvas,
  addObjectsInCanvas,
  removeObjectsInCanvas,
  createCanvas,
  resetZoomAndPanInCanvas,
} from "./canvas";

import { registerCanvasEvents, registerKeyEvents } from "./event";

const DrawingboardContainer = forwardRef(function Drawingboard(props, ref) {
  const context = useContext(AppContext);
  const { selectedMode, brushSize, selectedColor } = context;
  const {
    onAddObjects: sendObjectsToOthers,
    onObjectsRemove: deleteObjectsFromOthers,
  } = props;
  const [currentZoom, setCurrentZoom] = useState(1);
  const [showZoom, setShowZoom] = useState(false);

  // Initating the canvas

  useEffect(() => {
    initiateCanvas();
  }, []);

  const initiateCanvas = () => {
    canvas = createCanvas(window);
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
  };

  // On change of object properties by the user

  useEffect(() => {
    canvas.freeDrawingBrush.color = selectedColor;
    changePropertyOfSelectedObjects("stroke", selectedColor);
    canvas.renderAll();
  }, [selectedColor]);

  useEffect(() => {
    canvas.freeDrawingBrush.width = brushSize;
    changePropertyOfSelectedObjects("strokeWidth", brushSize);
    canvas.renderAll();
  }, [brushSize]);

  const changePropertyOfSelectedObjects = (property, value) => {
    changePropertyOfSelectedObjectsInCanvas({ canvas, property, value });
    sendSelectedObjectsToOthers();
  };

  // Registering events

  useEffect(() => {
    if (!canvas) {
      return;
    }
    return registerCanvasEvents({
      canvas,
      sendObjectsToOthers,
      selectedMode,
    });
  }, [canvas, selectedMode]);

  useEffect(() => {
    return registerKeyEvents({ deleteSelectedObjects });
  }, []);

  // On mode change
  useEffect(onModeChange(canvas, selectedMode), [selectedMode, canvas]);

  // Communication directly with canvas

  useImperativeHandle(ref, () => {
    return {
      getCanvasAsJSON,
      loadFromJSON,
      addObjects,
      removeObjects,
      resetZoomAndPan,
    };
  });

  // Canvas interfaces
  const sendSelectedObjectsToOthers = () => {
    const selectedObjects = getSelectedObjectsInCanvas(canvas);
    sendObjectsToOthers(selectedObjects);
  };

  const deleteSelectedObjects = () => {
    const ids = deleteSelectedObjectsInCanvas(canvas);
    deleteObjectsFromOthers(ids);
  };

  const addObjects = (objectsToAdd, nameOfTheAdder) => {
    addObjectsInCanvas({ canvas, objectsToAdd, nameOfTheAdder });
  };

  const removeObjects = (ids) => {
    removeObjectsInCanvas({ canvas, ids });
  };
  const loadFromJSON = (fabricJSON) => {
    canvas.loadFromJSON(fabricJSON);
  };

  const getCanvasAsJSON = () => {
    return canvas.toJSON(["id"]);
  };

  const resetZoomAndPan = () => {
    resetZoomAndPanInCanvas({ canvas, setCurrentZoom, setShowZoom });
  };

  return (
    <>
      <style>{style({ showZoom })}</style>
      <div className="canvas-box">
        <div className="zoom-info">
          <div className="inner-text">{(currentZoom * 100).toFixed(2)}%</div>
        </div>
        <canvas id="c"></canvas>
      </div>
    </>
  );
});

const style = ({ showZoom }) => `
    .canvas-box {
        display:inline-block;
    }
    .zoom-info {
      opacity:${showZoom ? 1 : 0};
      position:absolute;
      left:50%;
      top:50%;
      transform: translate(-50%, -50%);
      color:black;
      padding:3px;
      border-radius:5px;
      background-color: rgba(0,0,0, 0.2);
      font-size:14px;
      transition: opacity 0.2s ease-in-out;
      font-weight:bold;
      z-index:1;
    }
    .inner-text {
      z-index:2;
    }
 
`;

export default DrawingboardContainer;
