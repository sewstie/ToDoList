import React from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

const Modal = ({ onClose, children }) => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-4">
        {children}
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    </div>,
    document.body
  );
};

export { Modal };
