import { COLOR_SCHEME, TFill, TType } from 'app/Components/shared-components/common-ui-eles/components.const'
import { Icons, TIconName } from 'app/libs/Icons/Icons.class'
import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

interface IButtonWithTooltipProps {
  id: string
  label: string
  icon?: TIconName
  type: TType
  fill?: TFill
  href?: string
  onClick?: () => void
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  size?: 'sm' | 'md' | 'lg'
  marginClassName?: string
  hasTooltip?: boolean
  tooltip?: string
  className?: string
  labelClassName?: string
  tooltipContainerClassName?: string
  disabled?: boolean
}

enum LabelBreakpoints {
  sm = 'sm:inline-block',
  md = 'md:inline-block',
  lg = 'lg:inline-block',
  xl = 'xl:inline-block',
  xxl = 'xxl:inline-block'
}

enum TooltipBreakpoints {
  sm = 'sm:hidden',
  md = 'md:hidden',
  lg = 'lg:hidden',
  xl = 'xl:hidden',
  xxl = 'xxl:hidden'
}

export const Button: React.FC<IButtonWithTooltipProps> = (props) => {
  const Component = props.href ? Link : 'button'
  const collapsable = (props.hasTooltip || !!props.tooltip) && props.breakpoint
  const fillStyle: TFill = props.fill ?? 'solid'
  const bgClassName = props.disabled ? 'disabled:bg-gray-400 disabled:bg-opacity-40 disabled:cursor-not-allowed' : COLOR_SCHEME[fillStyle].bg[props.type]
  const textClassName = COLOR_SCHEME[fillStyle].text[props.type]
  const padding = props.size === 'sm' ? 'py-1 px-3' : props.size === 'lg' ? 'py-3 px-6' : 'py-3 px-4'

  return (
    <Component
      to={props.href ? props.href : null}
      onClick={props.onClick ? props.onClick : null}
      className={`justify-center ${props.className || ''} ${padding} ${props.marginClassName ?? 'mr-3'} inline-flex items-center leading-none text-sm rounded ${textClassName} ${bgClassName}`}
      data-tip={true}
      data-for={props.id}
      disabled={props.disabled ?? false}
    >
      {!!props.icon && Icons.render(props.icon)}<span className={`${props.icon ? 'ml-2' : ''} ${collapsable ? 'hidden' : ''} ${props.breakpoint ? LabelBreakpoints[props.breakpoint] : ''} ${props.labelClassName ?? ''}`}>{props.label}</span>
      {(props.hasTooltip || props.tooltip) && (
        <span className={props.breakpoint ? TooltipBreakpoints[props.breakpoint] : props.tooltipContainerClassName || ''}>
          <ReactTooltip id={props.id} effect="solid">
            {props.tooltip || props.label}
          </ReactTooltip>
        </span>
      )}
    </Component>
  )
}
