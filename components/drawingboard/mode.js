import { drawModes } from "../../constant/menu";
import { Pencil, Pan, Select, None, Rectangle } from "../../constant/mode";

export const onModeChange = (canvas, selectedMode) => () => {
  if (!canvas) {
    return;
  }

  const disableSelectForObjects = () => {
    canvas.selection = false;
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: false });
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const enableSelectForObjects = () => {
    canvas.selection = true;
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: true });
    });
  };

  const isShapeDrawingMode =
    drawModes.includes(selectedMode) && selectedMode !== Pencil;

  if (isShapeDrawingMode) {
    canvas.defaultCursor = "crosshair";
    canvas.isDrawingMode = false;
    return;
  } else if (selectedMode === Pencil) {
    canvas.isDrawingMode = true;
    disableSelectForObjects();
    return;
  } else if (selectedMode === Select) {
    enableSelectForObjects();
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "move";
    canvas.isDrawingMode = false;
    return;
  } else if (selectedMode === Pan) {
    disableSelectForObjects();
    canvas.isDrawingMode = false;
    canvas.defaultCursor = "grab";
    canvas.hoverCursor = "grab";
    return;
  } else if (selectedMode === None) {
    canvas.isDrawingMode = false;
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "auto";
    return;
  }
};
