import { IModalProps } from 'app/state/modal.state'
import { createContext, useContext } from 'react'

export interface TModalContext {
  modalProps: Partial<IModalProps> | null
 };

const initialState: TModalContext = {
  modalProps: null
}

export const ModalContext = createContext(initialState)
export const useModalContext = () => useContext(ModalContext)
