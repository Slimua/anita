import { Bucket } from 'app/state/bucket.state'
import { IButtonWithTooltipProps } from 'app/components/shared-components/common-ui-eles/button.component'
import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { TIconName } from 'app/libs/icons/icons.class'
import { ReactNode } from 'react'
import { ModalStateAtoms } from './modal-state.atoms'

export interface IModalPropsOpen {
  isOpen?: true
  title: string
  actionText: string
  children: ReactNode
  type?: Type.primary | Type.danger
  icon?: TIconName
  iconClassName?: string
  disableAction?: boolean
  hideCancelButton?: boolean
  hideActionRow?: boolean
  leftButton?: IButtonWithTooltipProps
  handleClickAction?: () => void
  handleClickCancel?: () => void
  handleOnClose?: () => void
}

// When isOpen is false or not provided
export interface IModalPropsClosed {
  isOpen: false
}

export type IModalProps = IModalPropsOpen | IModalPropsClosed

export class ModalState {
  public static showModal = (props: IModalProps) => {
    Bucket.general.set(ModalStateAtoms.modalProps, { type: Type.primary, ...props, isOpen: true } as IModalPropsOpen)
  }

  public static updateModal = (props: Partial<IModalPropsOpen>) => {
    const currentProps = Bucket.general.get(ModalStateAtoms.modalProps)
    Bucket.general.set(ModalStateAtoms.modalProps, { ...currentProps, ...props } as IModalPropsOpen)
  }

  public static hideModal = () => {
    Bucket.general.set(ModalStateAtoms.modalProps, { isOpen: false })
  }
}
