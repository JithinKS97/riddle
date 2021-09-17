import { fabric } from "fabric";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { PENCIL, ERASER, PAN, SELECT, NONE } from "../constant/mode";
import { AppContext } from ".././context/App";

let canvas, mousePressed, timeout;

fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

const parametersToLook = [
  "top",
  "left",
  "angle",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY",
  "stroke",
  "strokeWidth",
];

const createCanvas = (window) => {
  const topBarClass = "css-198em1k";
  const canvasConfig = {
    isDrawingMode: true,
    width: window.innerWidth,
    height:
      window.innerHeight -
      document.getElementsByClassName(topBarClass)[0].offsetHeight,
    backgroundColor: "rgba(0,0,0,0)",
  };
  return new fabric.Canvas("c", canvasConfig);
};

const DrawingboardContainer = forwardRef(function Drawingboard(props, ref) {
  const context = useContext(AppContext);
  const { selectedMode, brushSize, selectedColor } = context;
  const { onAddObjects, onObjectsRemove } = props;
  const [currentZoom, setCurrentZoom] = useState(1);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    canvas = createCanvas(window);
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
  }, []);

  useEffect(() => {
    console.log(selectedColor);
    canvas.freeDrawingBrush.color = selectedColor;
    changePropertyOfSelectedObjects("stroke", selectedColor);
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
    changePropertyOfSelectedObjects("strokeWidth", brushSize);
    canvas.renderAll();
  }, [brushSize]);

  useEffect(() => {
    switch (selectedMode) {
      case PENCIL:
        canvas.isDrawingMode = true;
        break;
      case SELECT:
        enableSelectForObjects();
        canvas.defaultCursor = "auto";
        canvas.hoverCursor = "move";
        canvas.isDrawingMode = false;
        break;
      case PAN:
        disableSelectForObjects();
        canvas.isDrawingMode = false;
        canvas.defaultCursor = "grab";
        canvas.hoverCursor = "grab";
        break;
      case NONE:
        disableSelectForObjects();
        canvas.isDrawingMode = false;
        canvas.defaultCursor = "auto";
        canvas.hoverCursor = "auto";
    }
  }, [selectedMode]);

  const disableSelectForObjects = () => {
    canvas.selection = false;
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: false });
    });
  };

  const enableSelectForObjects = () => {
    canvas.selection = true;
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: true });
    });
  };

  const registerEvents = () => {
    canvas.on("path:created", (res) => {
      res.path.set({
        id: uuidv4(),
      });
      const newObject = res.path.toObject(["id"]);
      onAddObjects([newObject]);
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

    canvas.on("mouse:move", function (event) {
      if (mousePressed && selectedMode === PAN) {
        const mEvent = event.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
        canvas.relativePan(delta);
      }
    });

    canvas.on("mouse:wheel", function (option) {
      setShowZoom(true);
      var delta = option.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
      option.e.preventDefault();
      option.e.stopPropagation();
      setCurrentZoom(zoom);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowZoom(false);
      }, 1000);
    });

    canvas.on("object:modified", () => {
      sendUpdatedObjectsToOthers();
    });

    addKeyDownEventListeners();

    return () => {
      document.onkeydown = null;
      canvas.__eventListeners = {};
    };
  };

  const sendUpdatedObjectsToOthers = () => {
    const modifiedObjects = canvas.getActiveObject();
    if (!modifiedObjects) {
      return;
    }
    if (!modifiedObjects._objects) {
      const objectJSON = modifiedObjects.toObject(["id"]);
      onAddObjects([objectJSON]);
    } else {
      canvas.discardActiveObject();
      const objectsJSON = modifiedObjects._objects.map((object) =>
        object.toJSON(["id"])
      );
      // Todo - Restore state of rotation also
      onAddObjects(objectsJSON);
      let selection = new fabric.ActiveSelection(modifiedObjects._objects, {
        canvas,
      });
      canvas.setActiveObject(selection);
    }
  };

  const resetZoomAndPan = () => {
    canvas.setZoom(1);
    setCurrentZoom(1);
    setShowZoom(true);
    setTimeout(() => {
      setShowZoom(false);
    }, 1000);
    canvas.absolutePan({ x: 0, y: 0 });
  };

  useImperativeHandle(ref, () => {
    return {
      getCanvasAsJSON,
      loadFromJSON,
      addObjects,
      removeObjects,
      resetZoomAndPan,
    };
  });

  const removeObjects = (ids) => {
    if (!ids) {
      return;
    }
    canvas.getObjects().forEach((object) => {
      if (ids.includes(object.id)) {
        animateObject(
          object,
          1,
          0,
          () => {
            canvas.remove(object);
          },
          "opacity"
        );
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

  const addObjects = (objectsToAdd, nameOfTheAdder) => {
    console.log(nameOfTheAdder);
    const idsOfObjectsCurrentlyPresent = canvas
      .getObjects()
      .map((object) => object.id);

    fabric.util.enlivenObjects(objectsToAdd, (enlivenedObjectsToAdd) => {
      enlivenedObjectsToAdd.forEach((enlivenedObjectToAdd) => {
        const objectAlreadyExist = idsOfObjectsCurrentlyPresent.includes(
          enlivenedObjectToAdd.id
        );
        if (!objectAlreadyExist) {
          canvas.add(enlivenedObjectToAdd);
          animateObject(enlivenedObjectToAdd, 0, 1, undefined, "opacity");
        } else {
          // This is required as if somebody else tries to move the object
          // It has to be with respect to the canvas
          canvas.discardActiveObject();
          let objectToModify = canvas
            .getObjects()
            .find((object) => object.id === enlivenedObjectToAdd.id);
          replaceObject(objectToModify, enlivenedObjectToAdd);
        }
      });
    });
  };

  const replaceObject = (objectToBeReplaced, objectToReplaceWith) => {
    parametersToLook.forEach((parameter) => {
      if (objectToBeReplaced[parameter] !== objectToReplaceWith[parameter]) {
        if (parameter === "stroke" || parameter === "strokeWidth") {
          canvas.remove(objectToBeReplaced);
          canvas.add(objectToReplaceWith);
          canvas.renderAll();
          return;
        }

        if (parameter === "angle") {
          // Todo - Animate rotate also
          const angleDifference = getAngleDifference(
            objectToBeReplaced[parameter],
            objectToReplaceWith[parameter]
          );
          objectToReplaceWith[parameter] =
            objectToBeReplaced[parameter] + angleDifference;
        }

        animateObject(
          objectToBeReplaced,
          objectToBeReplaced[parameter],
          objectToReplaceWith[parameter],
          undefined,
          parameter
        );
      }
    });
  };

  const getAngleDifference = (angle1, angle2) => {
    const diff = ((angle2 - angle1 + 180) % 360) - 180;
    return diff < -180 ? diff + 360 : diff;
  };

  const animateObject = (
    object,
    startValue,
    endValue,
    onComplete,
    parameter
  ) => {
    fabric.util.animate({
      startValue,
      endValue,
      duration: 200,
      onChange: function (value) {
        object[parameter] = value;
        canvas.renderAll();
      },
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
        object.setCoords();
      },
      easing: fabric.util.ease.easeInOutQuad,
    });
  };

  const addKeyDownEventListeners = () => {
    document.onkeydown = handleKeyDown;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteSelectedItems();
    }
  };

  const deleteSelectedItems = () => {
    const selectedObjects = canvas.getActiveObjects();
    const ids = selectedObjects.map((selectedObject) => selectedObject.id);
    canvas.getObjects().forEach((object) => {
      if (ids.includes(object.id)) {
        canvas.remove(object);
      }
    });
    onObjectsRemove(ids);
    canvas.discardActiveObject();
  };

  const changePropertyOfSelectedObjects = (property, value) => {
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) {
      return;
    }
    const ids = selectedObjects.map((selectedObject) => selectedObject.id);
    canvas.getObjects().forEach((object) => {
      if (ids.includes(object.id)) {
        object.set({
          [property]: value,
        });
      }
    });
    sendUpdatedObjectsToOthers();
  };

  return (
    <>
      <style>{style({ showZoom })}</style>
      <div onKeyDown={handleKeyDown} className="canvas-box">
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
