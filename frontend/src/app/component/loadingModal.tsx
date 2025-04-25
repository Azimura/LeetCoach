import {
  faCircleNotch,
  faCircleXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

interface LoadingModalProps {
  visible: boolean;
  onClose: Function;
  loadingMessage: string;
  closeable: boolean;
}
export default function LoadingModal({
  visible,
  loadingMessage,
  onClose,
  closeable,
}: LoadingModalProps) {
  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            onClose();
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="flex gap-5 flex-col w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {closeable && (
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="absolute right-5 top-5 cursor-pointer"
                      onClick={() => {
                        onClose();
                      }}
                    />
                  )}
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="text-[128px] text-center text-black animate-spin"
                  />
                  <p className="text-[32px] text-center text-black">
                    {loadingMessage}
                  </p>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
