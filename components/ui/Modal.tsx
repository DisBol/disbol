import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CloseRoundedIcon } from "@/components/icons/CloseRoundedIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  showCloseButton = true,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay/Backdrop con opacidad muy sutil */}
        <Dialog.Overlay className="fixed inset-0 bg-black/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <Dialog.Content
          className={`
            fixed left-[50%] top-[50%] z-50 grid w-full ${sizeClasses[size]} 
            translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-0 shadow-lg 
            duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out 
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] 
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] 
            rounded-lg 
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
              {showCloseButton && (
                <Dialog.Close className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                  <CloseRoundedIcon className="h-5 w-5" />
                </Dialog.Close>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
