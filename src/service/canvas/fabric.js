import { fabric } from "fabric";
var FileSaver = require("file-saver");

export const parametersToLook = [
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

import {
  animateObject,
  highlightModification,
  highlightObject,
} from "./animation";

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

export const updateObjectsInCanvas = ({ canvas, updatedValues, updater }) => {
  canvas.discardActiveObject();

  const { targetObjects, sourceObjects } = getSourceAndTarget({
    updatedValues,
    canvas,
  });

  highlightModification({
    targetObjects,
    sourceObjects,
    canvas,
    user: updater,
  });

  for (let i = 0; i < targetObjects.length; i++) {
    replaceObject({
      objectToBeReplaced: sourceObjects[i],
      objectToReplaceWith: targetObjects[i],
      canvas,
    });
  }
};

const getSourceAndTarget = ({ updatedValues, canvas }) => {
  let targetObjects = [],
    sourceObjects = [];

  for (let updatedValue of updatedValues) {
    const sourceObject = canvas
      .getObjects()
      .find((object) => object.id === updatedValue.id);

    sourceObjects.push(sourceObject);

    let targetObject;

    sourceObject.clone((_clone) => {
      targetObject = _clone;
      targetObject.set({
        id: sourceObject.id,
      });
    });

    for (let parameter of parametersToLook) {
      if (targetObject[parameter] !== updatedValue[parameter]) {
        targetObject[parameter] = updatedValue[parameter];
      }
    }

    targetObjects.push(targetObject);
  }
  return { sourceObjects, targetObjects };
};

export const addObjectsInCanvas = ({ canvas, objectsToAdd, adder }) => {
  fabric.util.enlivenObjects(objectsToAdd, (enlivenedObjectsToAdd) => {
    enlivenedObjectsToAdd.forEach((enlivenedObjectToAdd) => {
      canvas.add(enlivenedObjectToAdd);
      if (adder) {
        highlightObject({
          object: enlivenedObjectToAdd,
          user: adder,
          canvas,
        });
      }
      animateObject({
        object: enlivenedObjectToAdd,
        startValue: 0,
        endValue: 1,
        parameter: "opacity",
        canvas,
      });
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

export const removeObjectsInCanvas = ({ canvas, ids, deleter }) => {
  if (!ids) {
    return;
  }
  canvas.discardActiveObject();

  let objectsToRemove = canvas
    .getObjects()
    .filter((object) => ids.includes(object.id));

  if (ids.length === 1) {
    highlightObject({ object: objectsToRemove[0], canvas, user: deleter });
  } else {
    highlightModification({
      sourceObjects: objectsToRemove,
      targetObjects: objectsToRemove,
      canvas,
      user: deleter,
    });
  }

  objectsToRemove.forEach((object) => {
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

const getAngleDifference = (angle1, angle2) => {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
};

export const extractUpdatedValues = (objects) => {
  const updatedValues = objects.map((object) => {
    const updatedValue = {};
    updatedValue.id = object.id;
    parametersToLook.map((parameter) => {
      updatedValue[parameter] = object[parameter];
    });
    return updatedValue;
  });
  return updatedValues;
};
