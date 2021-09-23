export const highlightObject = ({ object, canvas, user }) => {
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

export const highlightModification = ({ objects, canvas, user }) => {
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
    opacity: 0.4,
  });
  return rect;
};

const fadeInTransformFadeOut = ({
  fromObj,
  toObj,
  canvas,
  parameters = [],
  opacity = 0.4,
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

export const animateObject = ({
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
