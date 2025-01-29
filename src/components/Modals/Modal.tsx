import React, { useEffect, useRef, ReactElement } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactElement<{ onClose?: () => void }>;
  isNotClosable?: boolean; // Nouvelle propriété
  size?: 'half-screen' | 'small';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  isNotClosable = false,
  size = 'half-screen',
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (!isNotClosable && e.key === 'Escape' && isOpen) {
        // Vérifie isNotClosable
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !isNotClosable &&
        e.target instanceof Node &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isNotClosable]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);
  const handleOutsideClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!isNotClosable && e.target === dialogRef.current) {
      // Vérifie isNotClosable
      onClose();
    }
  };

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.padding = '0';
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`backdrop:bg-black/50`}
      onClick={handleOutsideClick}
    >
      <div
        ref={contentRef}
        className={`fixed right-0 top-0 h-full  w-full ${size === 'half-screen' ? 'md:w-1/2' : 'md:w-1/2 lg:w-[480px]'} bg-white transform modal-content ${isOpen ? 'modal-content-open' : 'modal-content-closed'}`}
      >
        {React.cloneElement(children, { onClose })}
      </div>
    </dialog>
  );
};

export default Modal;
