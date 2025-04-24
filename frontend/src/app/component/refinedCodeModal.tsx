import {
  faCircleCheck,
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
import { Editor } from "@monaco-editor/react";
import { Fragment } from "react";

interface RefinedCode {
  message: string;
  result: number;
}
interface RefineCodeModalProps {
  visible: boolean;
  onClose: Function;
  refinedCode: RefinedCode;
}
export default function RefineCodeModal({
  visible,
  refinedCode,
  onClose,
}: RefineCodeModalProps) {
  const DisplayLoading = () => {
    return (
      <>
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="text-[128px] text-center text-black animate-spin"
        />
        <p className="text-[32px] text-center text-black">Refining Code...</p>
      </>
    );
  };
  const DisplayRefinedCode = () => {
    if (refinedCode.result) {
      return (
        <>
          <div className="h-1/1 flex flex-col justify-between">
            <div className="flex justify-between"></div>
            <h1 className="font-bold text-2xl text-black"> Refined Code </h1>
            <div className="h-6 bg-gray-300"></div>
            <Editor
              height={300}
              defaultLanguage="python"
              defaultValue={refinedCode.message}
              options={{
                fontSize: 14,
                minimap: {
                  enabled: false,
                },
                autoClosingBrackets: "languageDefined",
                lineNumbers: "off",
                readOnly: true,
                renderLineHighlight: "none",
                scrollbar: {
                  vertical: "hidden",
                },
                selectionHighlight: false,
                selectionClipboard: false,
                scrollBeyondLastLine: false,
                occurrencesHighlight: "off",
                foldingHighlight: false,
              }}
              className=" bg-gray"
            />
          </div>
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
            Failed To Refine Code
          </p>
          <div className="flex flex-col gap-2">
            <span className="bg-[#000a2008] border-[#0000000d] rounded-[5px] border-[1px] text-[#262626bf] font-[.75rem]  p-3">
              {refinedCode.message}
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
                  {Object.keys(refinedCode).length
                    ? DisplayRefinedCode()
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
