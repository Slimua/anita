import { atom } from 'jotai'
import { IModalProps } from './modal-state.class'

export class ModalStateAtoms {
  public static modalProps = atom<IModalProps>({
    isOpen: false
  })
}
