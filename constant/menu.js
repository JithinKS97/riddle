import { HiOutlineMinus } from "react-icons/hi";
import { BiRectangle } from "react-icons/bi";
import { BiCircle } from "react-icons/bi";
import { FaPencilAlt } from "react-icons/fa";
import { FiMove } from "react-icons/fi";
import { ResetPan, ResetZoom } from "../components/menu/custom icons";
import { AiOutlineSelect } from "react-icons/ai";
import { BiExport, BiImport } from "react-icons/bi";

export const drawOptions = [
  {
    label: "Pencil",
    icon: FaPencilAlt,
  },
  {
    label: "Line",
    icon: HiOutlineMinus,
  },
  {
    label: "Rectangle",
    icon: BiRectangle,
  },
  {
    label: "Ellipse",
    icon: BiCircle,
  },
];

export const resetOptions = [
  {
    label: "Reset pan",
    icon: ResetPan,
  },
  {
    label: "Reset zoom",
    icon: ResetZoom,
  },
];

export const cursorOptions = [
  {
    label: "Select",
    icon: AiOutlineSelect,
  },
  {
    label: "Pan",
    icon: FiMove,
  },
];

export const fileOptions = [
  {
    label: "Export",
    icon: BiExport,
  },
  {
    label: "Import",
    icon: BiImport,
  },
];

export const drawModes = drawOptions.map((drawOption) => drawOption.label);
export const cursorModes = cursorOptions.map(
  (cursorOption) => cursorOption.label
);
