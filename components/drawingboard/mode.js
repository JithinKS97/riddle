import { PENCIL, PAN, SELECT, NONE } from "../../constant/mode";

export const onModeChange = (canvas, selectedMode) => () => {
  if (!canvas) {
    return;
  }

  switch (selectedMode) {
    case PENCIL:
      canvas.isDrawingMode = true;
      break;
    case SELECT:
      enableSelectForObjects();
      canvas.defaultCursor = "auto";
      canvas.hoverCursor = "move";
      canvas.isDrawingMode = false;
      break;
    case PAN:
      disableSelectForObjects();
      canvas.isDrawingMode = false;
      canvas.defaultCursor = "grab";
      canvas.hoverCursor = "grab";
      break;
    case NONE:
      disableSelectForObjects();
      canvas.isDrawingMode = false;
      canvas.defaultCursor = "auto";
      canvas.hoverCursor = "auto";
  }

  const disableSelectForObjects = () => {
    canvas.selection = false;
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: false });
    });
  };

  const enableSelectForObjects = () => {
    canvas.selection = true;
    canvas.getObjects().forEach((object) => {
      object.set({ selectable: true });
    });
  };
};
