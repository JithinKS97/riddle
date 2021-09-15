import { fabric } from "fabric";
import { forwardRef, useEffect, useImperativeHandle, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { PENCIL, ERASER, PAN, SELECT, NONE } from "../constant/mode";
import { AppContext } from ".././context/App";

let canvas, mousePressed;

fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

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

  useEffect(() => {
    canvas = createCanvas(window);
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 3;
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
    canvas.getObjects().forEach((object) => {
      object.selectable = false;
    });
  };

  const enableSelectForObjects = () => {
    canvas.getObjects().forEach((object) => {
      object.selectable = true;
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
      var delta = option.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
      option.e.preventDefault();
      option.e.stopPropagation();
    });

    canvas.on("object:modified", () => {
      const modifiedObjects = canvas.getActiveObject();
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
    });

    addKeyDownEventListeners();

    return () => {
      canvas.__eventListeners = {};
    };
  };

  useImperativeHandle(ref, () => {
    return {
      getCanvasAsJSON,
      loadFromJSON,
      addObjects,
      removeObjects,
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
    const idsOfObjectsCurrentlyPresent = canvas
      .getObjects()
      .map((object) => object.id);

    fabric.util.enlivenObjects(objectsToAdd, (enlivenedObjectsToAdd) => {
      console.log(enlivenedObjectsToAdd);

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
        canvas.deactivateA;
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

  const parametersToLook = [
    "top",
    "left",
    "angle",
    "scaleX",
    "scaleY",
    "skewX",
    "skewY",
  ];

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
      duration: 150,
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
    return () => {
      document.onkeydown = null;
    };
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

  return (
    <>
      <style>{style}</style>
      <div onKeyDown={handleKeyDown} className="canvas-box">
        <canvas id="c"></canvas>
      </div>
    </>
  );
});

const style = ({}) => `
    .canvas-box {
        display:inline-block;
    }
`;

export default DrawingboardContainer;
