import React from "react";
import {
  Lightbulb,
  AlertTriangle,
  TriangleAlert ,
  Info,
  ShieldAlert,
  Pin,
} from "lucide-react";

const ICONS = {
  tip: <Lightbulb size={20} />,
  warning: <AlertTriangle size={20} />,
  danger: <TriangleAlert  size={20} />,
  info: <Info size={20} />,
  caution: <ShieldAlert size={20} />,
  note: <Pin size={20} />,
};

const TITLES = {
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
  info: "Info",
  caution: "Caution",
  note: "Note",
};

const Admonition = ({ type = "note", children }) => {
  return (
    <div
      className={`admonition admonition-${type} 
        dark:bg-opacity-10 dark:border-opacity-75`}
    >
      <div className="flex items-center admonition-title mb-2 text-lg">
        {ICONS[type]} <span className="ml-2">{TITLES[type]}</span>
      </div>
      <div className="admonition-content">{children}</div>
    </div>
  );
};

export default Admonition;
