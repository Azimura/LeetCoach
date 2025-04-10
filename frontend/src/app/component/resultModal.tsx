import {
  faCircleCheck,
  faCircleNotch,
  faCircleXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

interface ErrorMessage {
  error?: string;
  error_line?: number;
  input?: string;
  result?: number;
}
interface Result {
  error_message: ErrorMessage;
  pass: number;
  submission_id: number;
  test_cases: number;
}
interface ResultModalProps {
  visible: boolean;
  onClose: Function;
  result: Result;
}
export default function ResultModal({
  visible,
  result,
  onClose,
}: ResultModalProps) {
  const DisplayLoading = () => {
    return (
      <>
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="text-[128px] text-center text-black animate-spin"
        />
        <p className="text-[32px] text-center text-black">Testing...</p>
      </>
    );
  };
  const DisplayResult = () => {
    if (result.error_message.result || result.pass == result.test_cases) {
      return (
        <>
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 text-[64px]"
          />
          <p className="text-[32px] text-center text-green-500">
            {result.pass} / {result.test_cases} Passed
          </p>
        </>
      );
    } else {
      return (
        <>
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="text-red-500 text-[64px]"
          />
          <p className="text-[32px] text-center text-red-500">
            {result.pass} / {result.test_cases} Passed
          </p>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-black">Input: </label>
            <span className="bg-[#000a2008] border-[#0000000d] rounded-[5px] border-[1px] text-[#262626bf] font-[.75rem]  p-3">
              {result.error_message.input}
            </span>
            <label className="font-semibold text-black">Error: </label>
            <span className="bg-[#000a2008] border-[#0000000d] rounded-[5px] border-[1px] text-[#262626bf] font-[.75rem]  p-3">
              {result.error_message.error}
            </span>
          </div>
        </>
      );
    }
  };
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
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute right-5 top-5 cursor-pointer"
                    onClick={() => {
                      onClose();
                    }}
                  />
                  {Object.keys(result).length
                    ? DisplayResult()
                    : DisplayLoading()}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
