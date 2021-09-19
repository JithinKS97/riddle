import { drawModes } from "../../constant/menu";
import { Pencil, Pan, Select, None } from "../../constant/mode";

export const onModeChange = (canvas, selectedMode) => () => {
  if (!canvas) {
    return;
  }

  const isShapeDrawingMode =
    drawModes.includes(selectedMode) && selectedMode !== Pencil;

  if (selectedMode === Select) {
    enableSelect(canvas);
  } else {
    disableSelect(canvas);
  }

  if (selectedMode === Pencil) {
    canvas.isDrawingMode = true;
  } else {
    canvas.isDrawingMode = false;
  }

  if (isShapeDrawingMode) {
    canvas.defaultCursor = "crosshair";
    canvas.hoverCursor = "crosshair";
    return;
  } else if (selectedMode === Select) {
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "move";
    return;
  } else if (selectedMode === Pan) {
    canvas.defaultCursor = "grab";
    canvas.hoverCursor = "grab";
    return;
  } else if (selectedMode === None) {
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "auto";
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
