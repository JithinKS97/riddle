import { fabric } from "fabric";

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
        animateObject({
          object: enlivenedObjectToAdd,
          startValue: 0,
          endValue: 1,
          onComplete: undefined,
          parameter: "opacity",
          canvas,
        });
      } else {
        // This is required as if somebody else tries to move the object
        // It has to be with respect to the canvas
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

const replaceObject = ({ objectToBeReplaced, objectToReplaceWith, canvas }) => {
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

      animateObject({
        object: objectToBeReplaced,
        startValue: objectToBeReplaced[parameter],
        endValue: objectToReplaceWith[parameter],
        onComplete: undefined,
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
  canvas.getObjects().forEach((object) => {
    if (ids.includes(object.id)) {
      animateObject({
        object,
        startValue: 1,
        endValue: 0,
        onComplete: () => {
          canvas.remove(object);
        },
        parameter: "opacity",
        canvas,
      });
      canvas.renderAll();
    }
  });
};

export const resetZoomAndPan = ({ canvas, setCurrentZoom, setShowZoom }) => {
  canvas.setZoom(1);
  setCurrentZoom(1);
  setShowZoom(true);
  setTimeout(() => {
    setShowZoom(false);
  }, 1000);
  canvas.absolutePan({ x: 0, y: 0 });
};

const animateObject = ({
  object,
  startValue,
  endValue,
  onComplete,
  parameter,
  canvas,
}) => {
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

const getAngleDifference = (angle1, angle2) => {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
};
