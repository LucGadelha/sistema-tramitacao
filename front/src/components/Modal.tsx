import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        
      </div>
    </div>
  );
};

export default Modal;
