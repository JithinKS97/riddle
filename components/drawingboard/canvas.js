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

export const addObjectsInCanvas = ({ canvas, objectsToAdd, adder }) => {
  const idsOfObjectsCurrentlyPresent = canvas
    .getObjects()
    .map((object) => object.id);

  const idsOfObjectsToBeAdded = objectsToAdd.map((object) => object.id);

  const isObjectBeingModified = findIfObjectIsBeingModified(
    idsOfObjectsCurrentlyPresent,
    idsOfObjectsToBeAdded
  );

  if (isObjectBeingModified) {
    canvas.discardActiveObject();
    highlightModification({ objects: objectsToAdd, canvas, user: adder });
  }

  fabric.util.enlivenObjects(objectsToAdd, (enlivenedObjectsToAdd) => {
    enlivenedObjectsToAdd.forEach((enlivenedObjectToAdd) => {
      if (!isObjectBeingModified) {
        canvas.add(enlivenedObjectToAdd);

        highlightObject({
          object: enlivenedObjectToAdd,
          user: adder,
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

const findIfObjectIsBeingModified = (
  idsOfObjectsCurrentlyPresent,
  idsOfObjectsToBeAdded
) => {
  for (const idOfObjectToBeAdded of idsOfObjectsToBeAdded) {
    if (idsOfObjectsCurrentlyPresent.includes(idOfObjectToBeAdded)) {
      return true;
    }
  }
  return false;
};

const highlightObject = ({ object, canvas, user }) => {
  object.clone((clone) => {
    const boundingRect = clone.getBoundingRect();
    let fromRect = getFabricRectFromBoundingRect(boundingRect, user.color);
    const parameters = ["left", "top", "width", "height"];
    let label = createLabelAtCorner({
      user,
      fromRect,
    });
    fadeInTransformFadeOut({
      fromObj: fromRect,
      toObj: fromRect,
      canvas,
      parameters,
    });
    fadeInTransformFadeOut({
      fromObj: label,
      toObj: label,
      canvas,
      opacity: 0.7,
    });
  });
};

const highlightModification = ({ objects, canvas, user }) => {
  const idsOfObjectsBeingUpdated = objects.map((object) => object.id);
  const objectsBeingUpdated = canvas
    .getObjects()
    .filter((obj) => idsOfObjectsBeingUpdated.includes(obj.id));
  fabric.util.enlivenObjects(objects, (objectsToReplaceWith) => {
    // Get bounding rect of each
    // Animate it
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

    let boundingRect = objectsBeingUpdatedGroup.getBoundingRect();
    const toRect = objectsToReplaceWithGroup.getBoundingRect();

    let fromRect = getFabricRectFromBoundingRect(boundingRect, user.color);

    let label = createLabelAtCorner({
      user,
      fromRect,
    });

    const parameters = ["left", "top", "width", "height"];

    fadeInTransformFadeOut({
      fromObj: fromRect,
      toObj: toRect,
      canvas,
      parameters,
    });

    fadeInTransformFadeOut({
      fromObj: label,
      toObj: {
        top: toRect.top - label.height - 5,
        left: toRect.left + toRect.width,
      },
      canvas,
      parameters: ["top", "left"],
      opacity: 0.7,
    });
  });
};

const createLabelAtCorner = ({ user, fromRect }) => {
  const text = new fabric.Text(user.name, {
    top: fromRect.top - 5,
    left: fromRect.left + fromRect.width,
    fontSize: 20,
    stroke: user.color,
    fill: user.color,
  });
  text.top = text.top - text.height;
  return text;
};

const getFabricRectFromBoundingRect = (boundingRect, stroke) => {
  const rect = new fabric.Rect({
    left: boundingRect.left,
    top: boundingRect.top,
    originX: "left",
    originY: "top",
    width: boundingRect.width,
    height: boundingRect.height,
    angle: 0,
    fill: "transparent",
    stroke,
    strokeWidth: 4,
    selectable: false,
    opacity: 0.3,
  });
  return rect;
};

const fadeInTransformFadeOut = ({
  fromObj,
  toObj,
  canvas,
  parameters = [],
  opacity = 0.3,
}) => {
  canvas.add(fromObj);

  animateObject({
    object: fromObj,
    startValue: 0,
    endValue: opacity,
    canvas,
    parameter: "opacity",
    duration: 50,
  });

  setTimeout(() => {
    animateObject({
      object: fromObj,
      startValue: opacity,
      endValue: 0,
      canvas,
      parameter: "opacity",
      duration: 100,
      onComplete: () => {
        canvas.remove(fromObj);
      },
    });
  }, 800);

  parameters.forEach((parameter) => {
    animateObject({
      object: fromObj,
      startValue: fromObj[parameter],
      endValue: toObj[parameter],
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

export const removeObjectsInCanvas = ({ canvas, ids, deleter }) => {
  if (!ids) {
    return;
  }
  canvas.discardActiveObject();

  let objectsToRemove = canvas
    .getObjects()
    .filter((object) => ids.includes(object.id));

  console.log(ids);

  if (ids.length === 1) {
    highlightObject({ object: objectsToRemove[0], canvas, user: deleter });
  } else {
    highlightModification({
      objects: objectsToRemove,
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
