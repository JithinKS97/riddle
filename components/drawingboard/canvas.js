import { fabric } from "fabric";
var FileSaver = require("file-saver");

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
  "fill",
];

export const createCanvas = (window) => {
  const topBarClass = "css-ir3bez";
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

export const changePropertyOfSelectedObjectsInCanvas = ({
  canvas,
  property,
  value,
}) => {
  const selectedObjects = canvas.getActiveObjects();
  if (selectedObjects.length === 0) {
    return;
  }
  selectedObjects.forEach(setProperty(property, value));
};

const setProperty = (property, value) => (object) => {
  object.set({
    [property]: value,
  });
};

export const getSelectedObjectsInCanvas = (canvas) => {
  const selectedObjects = canvas.getActiveObject();
  if (!selectedObjects) {
    return;
  }
  if (!selectedObjects._objects) {
    const objectJSON = selectedObjects.toObject(["id"]);
    return [objectJSON];
  } else {
    canvas.discardActiveObject();
    const objectsJSON = selectedObjects._objects.map((object) =>
      object.toJSON(["id"])
    );
    let selection = new fabric.ActiveSelection(selectedObjects._objects, {
      canvas,
    });
    canvas.setActiveObject(selection);
    return objectsJSON;
  }
};

export const deleteSelectedObjectsInCanvas = (canvas) => {
  const selectedObjects = canvas.getActiveObjects();
  const ids = selectedObjects.map((selectedObject) => selectedObject.id);
  canvas.getObjects().forEach((object) => {
    if (ids.includes(object.id)) {
      canvas.remove(object);
    }
  });
  canvas.discardActiveObject();
  return ids;
};

export const addObjectsInCanvas = ({
  canvas,
  objectsToAdd,
  nameOfTheAdder,
}) => {
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

        highlightAddition({
          objectToAdd: enlivenedObjectToAdd,
          nameOfTheAdder,
          canvas,
        });

        animateObject({
          object: enlivenedObjectToAdd,
          startValue: 0,
          endValue: 1,
          parameter: "opacity",
          canvas,
        });
      } else {
        // This is required as if somebody else tries to move the object
        // It has to be with respect to the canvas

        highlightModification({ objectsToAdd, nameOfTheAdder, canvas });

        canvas.discardActiveObject();

        let objectToModify = canvas
          .getObjects()
          .find((object) => object.id === enlivenedObjectToAdd.id);
        replaceObject({
          objectToBeReplaced: objectToModify,
          objectToReplaceWith: enlivenedObjectToAdd,
          canvas,
        });
      }
    });
  });
};

const highlightAddition = ({ objectToAdd, canvas }) => {
  objectToAdd.clone((clone) => {
    const boundingRect = clone.getBoundingRect();
    morphRect({
      fromRect: boundingRect,
      toRect: boundingRect,
      canvas,
    });
  });
};

const highlightModification = ({ objectsToAdd, canvas }) => {
  const idsOfObjectsBeingUpdated = objectsToAdd.map((object) => object.id);
  const objectsBeingUpdated = canvas
    .getObjects()
    .filter((obj) => idsOfObjectsBeingUpdated.includes(obj.id));
  fabric.util.enlivenObjects(objectsToAdd, (objectsToReplaceWith) => {
    // Get bounding rect of each
    // Animate tit
    const objectsToReplaceWithClone = [];
    objectsToReplaceWith.forEach((obj) =>
      obj.clone((clone) => {
        objectsToReplaceWithClone.push(clone);
      })
    );

    const objectsBeingUpdatedClone = [];
    objectsBeingUpdated.forEach((obj) =>
      obj.clone((clone) => {
        objectsBeingUpdatedClone.push(clone);
      })
    );

    const objectsBeingUpdatedGroup = new fabric.Group(objectsBeingUpdatedClone);
    const objectsToReplaceWithGroup = new fabric.Group(
      objectsToReplaceWithClone
    );

    const fromRect = objectsBeingUpdatedGroup.getBoundingRect();
    const toRect = objectsToReplaceWithGroup.getBoundingRect();

    morphRect({ fromRect, toRect, canvas });
  });
};

const morphRect = ({ fromRect, toRect, canvas }) => {
  const fromRectBody = new fabric.Rect({
    left: fromRect.left,
    top: fromRect.top,
    originX: "left",
    originY: "top",
    width: fromRect.width,
    height: fromRect.height,
    angle: 0,
    fill: "transparent",
    stroke: "black",
    strokeWidth: 2,
    selectable: false,
  });

  canvas.add(fromRectBody);

  animateObject({
    object: fromRectBody,
    startValue: 0,
    endValue: 0.3,
    canvas,
    parameter: "opacity",
    duration: 50,
  });

  setTimeout(() => {
    animateObject({
      object: fromRectBody,
      startValue: 0.3,
      endValue: 0,
      canvas,
      parameter: "opacity",
      duration: 100,
      onComplete: () => {
        canvas.remove(fromRectBody);
      },
    });
  }, 800);

  ["left", "top", "width", "height"].forEach((parameter) => {
    animateObject({
      object: fromRectBody,
      startValue: fromRect[parameter],
      endValue: toRect[parameter],
      canvas,
      parameter,
    });
  });
};

const replaceObject = ({ objectToBeReplaced, objectToReplaceWith, canvas }) => {
  parametersToLook.forEach((parameter) => {
    if (objectToBeReplaced[parameter] !== objectToReplaceWith[parameter]) {
      if (["stroke", "strokeWidth", "fill"].includes(parameter)) {
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

      animateObject({
        object: objectToBeReplaced,
        startValue: objectToBeReplaced[parameter],
        endValue: objectToReplaceWith[parameter],
        parameter,
        canvas,
      });
    }
  });
};

export const removeObjectsInCanvas = ({ canvas, ids }) => {
  if (!ids) {
    return;
  }
  canvas.discardActiveObject();
  canvas.getObjects().forEach((object) => {
    if (ids.includes(object.id)) {
      animateObject({
        object,
        startValue: 1,
        endValue: 0,
        onComplete: () => {
          object.set({
            active: false,
          });
          canvas.remove(object);
        },
        parameter: "opacity",
        canvas,
      });
      canvas.renderAll();
    }
  });
};

export const resetZoomAndPanInCanvas = ({
  canvas,
  setCurrentZoom,
  setShowZoom,
}) => {
  canvas.setZoom(1);
  setCurrentZoom(1);
  setShowZoom(true);
  setTimeout(() => {
    setShowZoom(false);
  }, 1000);
  canvas.absolutePan({ x: 0, y: 0 });
};

export const resetZoomInCanvas = ({ canvas, setCurrentZoom, setShowZoom }) => {
  canvas.setZoom(1);
  setCurrentZoom(1);
  setShowZoom(true);
  setTimeout(() => {
    setShowZoom(false);
  }, 1000);
};

export const resetPanInCanvas = ({ canvas }) => {
  canvas.absolutePan({ x: 0, y: 0 });
};

export const saveFile = (jsonData) => {
  jsonData = JSON.stringify(jsonData);
  const blob = new Blob([jsonData], {
    type: "application/json",
  });
  FileSaver.saveAs(blob, "riddle.json");
};

const animateObject = ({
  object,
  startValue,
  endValue,
  onComplete,
  parameter,
  canvas,
  duration,
}) => {
  fabric.util.animate({
    startValue,
    endValue,
    duration: 200 || duration,
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

const getAngleDifference = (angle1, angle2) => {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
};
