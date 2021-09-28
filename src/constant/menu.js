import { HiOutlineMinus } from "react-icons/hi";
import { BiRectangle } from "react-icons/bi";
import { BiCircle } from "react-icons/bi";
import { FaPencilAlt } from "react-icons/fa";
import { FiMove, FiTriangle } from "react-icons/fi";
import {
  ResetPan,
  ResetZoom,
  SaveIPFS,
  LoadIPFS,
} from "../components/menu/custom icons";
import { AiOutlineSelect } from "react-icons/ai";
import { FiSave, FiDownload } from "react-icons/fi";

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
  {
    label: "Triangle",
    icon: FiTriangle,
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
    label: "Save to local",
    icon: FiSave,
  },
  {
    label: "Load from local",
    icon: FiDownload,
  },
  // {
  //   label: "Save to IPFS",
  //   icon: SaveIPFS,
  // },
  // {
  //   label: "Load from IPFS",
  //   icon: LoadIPFS,
  // },
];

export const drawModes = drawOptions.map((drawOption) => drawOption.label);
export const cursorModes = cursorOptions.map(
  (cursorOption) => cursorOption.label
);
