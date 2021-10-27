import { drawModes } from "../../constant/menu";
import { Pencil, Pan, Select, None, Eraser } from "../../constant/mode";

export const onModeChange = (canvas, selectedMode) => () => {
  if (!canvas) {
    return;
  }

  const isShapeDrawingMode =
    drawModes.includes(selectedMode) && selectedMode !== Pencil;

  const isEraserMode = selectedMode === Eraser;

  if (selectedMode === Select) {
    enableSelect(canvas);
  } else if (selectedMode !== None) {
    disableSelect(canvas);
  }

  if (selectedMode === Pencil) {
    canvas.isDrawingMode = true;
  } else {
    canvas.isDrawingMode = false;
  }
  const setCursor = (cursor) => {
    canvas.getObjects().forEach((object) => {
      object.set({
        hoverCursor: cursor,
      });
    });
    canvas.defaultCursor = cursor;
    canvas.hoverCursor = cursor;
  };

  if (isShapeDrawingMode) {
    setCursor("crosshair");
    return;
  } else if (selectedMode === Select) {
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "move";
    return;
  } else if (selectedMode === Pan) {
    setCursor("grab");
    return;
  } else if (selectedMode === None) {
    setCursor("auto");
  } else if (isEraserMode) {
    setCursor("pointer");
  }
};

const disableSelect = (canvas) => {
  canvas.set({
    selection: false,
  });
  canvas.getObjects().forEach((object) => {
    object.set({ selectable: false });
  });
  canvas.discardActiveObject();
  canvas.renderAll();
};

const enableSelect = (canvas) => {
  canvas.set({
    selection: true,
  });
  canvas.getObjects().forEach((object) => {
    object.set({ selectable: true });
  });
};
