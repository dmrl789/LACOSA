import { Fragment, MouseEvent, cloneElement, isValidElement, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

const overflowItems = [
  { label: "Culture & events", description: "Upcoming happenings across Palermo" },
  { label: "Community", description: "Clubs, groups, and locals to meet" },
  { label: "Relocation pack", description: "Docs, health, finance starter guides" },
  { label: "About", description: "Product vision & contact" },
];

export default function OverflowMenu({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const triggerEl = useMemo(() => {
    if (isValidElement(trigger)) {
      const originalOnClick = (trigger.props as { onClick?: (event: MouseEvent) => void }).onClick;
      return cloneElement(trigger, {
        onClick: (event: MouseEvent) => {
          originalOnClick?.(event);
          setOpen(true);
        },
      });
    }
    return (
      <button type="button" onClick={() => setOpen(true)}>
        {trigger}
      </button>
    );
  }, [trigger]);

  return (
    <>
      {triggerEl}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="rounded-t-3xl bg-white p-5 shadow-sheet">
                <div className="mb-4 flex items-center">
                  <Dialog.Title className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    More from LACOSA
                  </Dialog.Title>
                  <button
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <ul className="space-y-3">
                  {overflowItems.map((item) => (
                    <li key={item.label} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
