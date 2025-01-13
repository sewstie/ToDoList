import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ onClose, children }) => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-4 w-1/5 h-1/5">{children}</div>
    </div>,
    document.body
  );
};

export { Modal };
