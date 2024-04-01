import { IModalProps } from 'app/components/shared-components/modals/modal.component'
import { createContext, useContext } from 'react'

export type TModalContext = {
  showModal: (modalProps: IModalProps) => void
  updateModal: (newModalProps: Partial<IModalProps>) => void
  hideModal: () => void
  modalProps: Partial<IModalProps> | null
 };

const initialState: TModalContext = {
  showModal: () => {},
  updateModal: () => {},
  hideModal: () => {},
  modalProps: null
}

export const ModalContext = createContext(initialState)
export const useModalContext = () => useContext(ModalContext)
