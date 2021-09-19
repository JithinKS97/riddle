import { drawModes } from "../../constant/menu";
import { Pencil, Pan, Select, None, Rectangle } from "../../constant/mode";

export const onModeChange = (canvas, selectedMode) => () => {
  if (!canvas) {
    return;
  }

  const disableSelect = () => {
    canvas.set({
      selection: false,
    });
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: false });
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const enableSelect = () => {
    canvas.set({
      selection: true,
    });
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: true });
    });
  };

  const isShapeDrawingMode =
    drawModes.includes(selectedMode) && selectedMode !== Pencil;

  if (isShapeDrawingMode) {
    disableSelect();
    canvas.defaultCursor = "crosshair";
    canvas.isDrawingMode = false;
    return;
  } else if (selectedMode === Pencil) {
    canvas.isDrawingMode = true;
    disableSelect();
    return;
  } else if (selectedMode === Select) {
    enableSelect();
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "move";
    canvas.isDrawingMode = false;
    return;
  } else if (selectedMode === Pan) {
    disableSelect();
    canvas.isDrawingMode = false;
    canvas.defaultCursor = "grab";
    canvas.hoverCursor = "grab";
    return;
  } else if (selectedMode === None) {
    canvas.isDrawingMode = false;
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "auto";
  }
};
