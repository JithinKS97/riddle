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

import {
  changePropertyOfSelectedObjectsInCanvas,
  deleteSelectedObjectsInCanvas,
  getSelectedObjectsInCanvas,
  addObjectsInCanvas,
  removeObjectsInCanvas,
  createCanvas,
  resetZoomAndPanInCanvas,
  resetZoomInCanvas,
  resetPanInCanvas,
  updateObjectsInCanvas,
  extractUpdatedValues,
} from "../../service/canvas/fabric";

import { registerCanvasEvents, registerKeyEvents } from "./event";

const DrawingboardContainer = forwardRef(function Drawingboard(props, ref) {
  const context = useContext(AppContext);
  const {
    selectedMode,
    brushSize,
    selectedStroke,
    setSelectedMode,
    selectedFill,
  } = context;
  const {
    onAddObjects: sendObjectsToOthers,
    onObjectsRemove: deleteObjectsFromOthers,
    onUpdateObjects: sendUpdatedValuesToOthers,
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
    canvas.freeDrawingBrush.color = selectedStroke;
    changePropertyOfSelectedObjects("stroke", selectedStroke);
    canvas.renderAll();
  }, [selectedStroke]);

  useEffect(() => {
    changePropertyOfSelectedObjects("fill", selectedFill);
    canvas.renderAll();
  }, [selectedFill]);

  useEffect(() => {
    canvas.freeDrawingBrush.width = brushSize;
    changePropertyOfSelectedObjects("strokeWidth", brushSize);
    canvas.renderAll();
  }, [brushSize]);

  const changePropertyOfSelectedObjects = (property, value) => {
    changePropertyOfSelectedObjectsInCanvas({ canvas, property, value });
    sendUpdatedValuesInCanvasToOthers();
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
      setCurrentZoom,
      setShowZoom,
      setSelectedMode,
      selectedFill,
      selectedStroke,
      brushSize,
      sendUpdatedValuesInCanvasToOthers,
    });
  }, [canvas, selectedMode, selectedFill, selectedStroke, brushSize]);

  useEffect(() => {
    return registerKeyEvents({ deleteSelectedObjects, window });
  }, [selectedMode, canvas]);

  useEffect(() => {
    return registerResize();
  }, []);

  const registerResize = () => {
    const topBarClass = "css-ir3bez";
    window.onresize = () => {
      canvas.setHeight(
        window.innerHeight -
          document.getElementsByClassName(topBarClass)[0].offsetHeight
      );
      canvas.setWidth(window.innerWidth);
    };
    return () => {
      window.onresize = null;
    };
  };

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
      resetZoom,
      resetPan,
      clearAndAddObjects,
      updateObjects,
    };
  });

  const sendUpdatedValuesInCanvasToOthers = () => {
    const selectedObjects = getSelectedObjectsInCanvas(canvas);
    if (!selectedObjects) {
      return;
    }
    const updatedValues = extractUpdatedValues(selectedObjects);
    sendUpdatedValuesToOthers(updatedValues);
  };

  const deleteSelectedObjects = () => {
    const ids = deleteSelectedObjectsInCanvas(canvas);
    deleteObjectsFromOthers(ids);
  };

  const addObjects = (objectsToAdd, adder) => {
    addObjectsInCanvas({ canvas, objectsToAdd, adder });
  };

  const updateObjects = (updatedValues, updater) => {
    updateObjectsInCanvas({ canvas, updatedValues, updater });
  };

  const clearAndAddObjects = (objectsToAdd) => {
    canvas.clear();
    addObjectsInCanvas({ canvas, objectsToAdd });
  };

  const removeObjects = (ids, deleter) => {
    removeObjectsInCanvas({ canvas, ids, deleter });
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

  const resetZoom = () => {
    resetZoomInCanvas({ canvas, setCurrentZoom, setShowZoom });
  };

  const resetPan = () => {
    resetPanInCanvas({ canvas });
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
