import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

// Context to manage modal state
const ModalContext = createContext();

// Modal provider component
function Modal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  function open(content) {
    setContent(content);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <ModalContext.Provider value={{ isOpen, open, close, content }}>
      {children}
    </ModalContext.Provider>
  );
}

// Window component that renders modal content
function Window() {
  const { isOpen, close, content } = useContext(ModalContext);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative max-h-[500px] w-full max-w-lg overflow-y-scroll rounded-lg bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={close}
          aria-label="Close modal"
          className="absolute top-2 right-2 text-2xl text-red-600 transition-all hover:text-red-800"
        >
          &times;
        </button>
        <div>{content}</div>
      </div>
    </div>,
    document.body,
  );
}

// Open component to trigger modal open
function Open({ children, content }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(content) });
}

// Close component to trigger modal close
function Close({ children }) {
  const { close } = useContext(ModalContext);
  return cloneElement(children, {
    onClick: close,
  });
}

Modal.Window = Window;
Modal.Open = Open;
Modal.Close = Close;

export default Modal;
