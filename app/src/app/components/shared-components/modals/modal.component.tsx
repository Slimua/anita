import React, { Fragment, ReactNode } from 'react'
import { Icons } from 'app/libs/icons/icons.class'
import ReactDOM from 'react-dom'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from 'app/components/shared-components/common-ui-eles/button.component'
import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { IModalProps, IModalPropsOpen, ModalState } from 'app/state/modal/modal-state.class'
import { useAtomValue } from 'jotai'
import { ModalStateAtoms } from 'app/state/modal/modal-state.atoms'

const Modal: React.FC<IModalProps> = (props) => {
  const handleActionClick = (callback?: () => void) => {
    if (typeof callback === 'function') {
      callback()
    }
    ModalState.hideModal()
  }
  const cancelAction = () => {
    (props as IModalPropsOpen).handleClickCancel?.()
    ModalState.hideModal()
  }
  const onCloseAction = () => {
    (props as IModalPropsOpen).handleOnClose?.()
  }
  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCloseAction}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  {(props as IModalPropsOpen).icon && (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      {Icons.render((props as IModalPropsOpen).icon!, `${(props as IModalPropsOpen).iconClassName} text-xl -mt-1`)}
                    </div>
                  )}
                  <div className="text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      {(props as IModalPropsOpen).title}
                    </Dialog.Title>
                    <div className="mt-2">
                      {(props as IModalPropsOpen).children}
                    </div>
                  </div>
                </div>
                {!(props as IModalPropsOpen).hideActionRow && (
                  <div className="flex items-center justify-end mt-5 sm:mt-4">
                    {(props as IModalPropsOpen).leftButton && (
                      <Button
                        {...(props as IModalPropsOpen).leftButton!}
                        marginClassName="mr-auto"
                      />
                    )}
                    {(props as IModalPropsOpen).hideCancelButton !== true && (
                      <Button
                        id="cancel"
                        label="Cancel"
                        type={Type.secondary}
                        onClick={cancelAction}
                      />
                    )}
                    {!!(props as IModalPropsOpen).ctas?.length && (props as IModalPropsOpen).ctas!.map((cta, index) => (
                      <Button
                        key={index}
                        id="action-button"
                        type={cta.actionType || (props as IModalPropsOpen).type!}
                        label={cta.actionText}
                        onClick={() => handleActionClick(cta.handleClickAction)}
                        disabled={cta.disableAction}
                      />
                    ))}
                  </div>)}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export const ModalPortal: React.FC = () => {
  const modalConfig = useAtomValue(ModalStateAtoms.modalProps)
  return (
    ReactDOM.createPortal(
      <Modal {...modalConfig} />,
      document.getElementById('modal-root')!
    )
  )
}
