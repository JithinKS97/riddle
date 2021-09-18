import { Pencil, Pan, Select, None } from "../../constant/mode";

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

  switch (selectedMode) {
    case Pencil:
      canvas.isDrawingMode = true;
      break;
    case Select:
      enableSelectForObjects();
      canvas.defaultCursor = "auto";
      canvas.hoverCursor = "move";
      canvas.isDrawingMode = false;
      break;
    case Pan:
      disableSelectForObjects();
      canvas.isDrawingMode = false;
      canvas.defaultCursor = "grab";
      canvas.hoverCursor = "grab";
      break;
    case None:
      disableSelectForObjects();
      canvas.isDrawingMode = false;
      canvas.defaultCursor = "auto";
      canvas.hoverCursor = "auto";
  }
};
