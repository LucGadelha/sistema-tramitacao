import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
