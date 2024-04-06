import { IBasicRadio, ICommonFormEleProps } from 'app/components/shared-components/forms-automator/form-automator.types'
import { FormEleContainer } from 'app/components/shared-components/forms-automator/form-layout/form-ele-container.component'
import { FormElementLabel } from 'app/components/shared-components/forms-automator/form-layout/form-element-label.component'
import { ValidatorsContainer } from 'app/components/shared-components/forms-automator/form-validation/validators-container.component'
import { useValidators } from 'app/components/shared-components/forms-automator/hooks/use-validators.hook'
import uniqueId from 'lodash/uniqueId'
import React, { memo, useRef, useState } from 'react'
import { ISectionElement } from 'app/models/section-element/section-element.declarations'
import { BasicRadioInfoIcon } from 'app/components/shared-components/forms-automator/form-fields/basic-radio-info-icon.component'
/* eslint-disable eqeqeq */

export const BasicRadio: React.FC<ICommonFormEleProps<IBasicRadio<ISectionElement>>> = memo(function BasicRadio ({ formEle, element, handleChange }: ICommonFormEleProps<IBasicRadio<ISectionElement>>) {
  const [touched, setTouched] = useState(false)
  const { current: fieldId } = useRef(uniqueId(formEle.fieldName))
  const [isValid, setIsValidForField] = useValidators(fieldId)

  const width = formEle.width ? formEle.width : 'w-full'

  if (!element[formEle.fieldName] && formEle.value) {
    element[formEle.fieldName] = formEle.value
  }

  // We use relaxed equal (==) here because the value of the radio button might be a string or a number.
  return (
    <FormEleContainer key={formEle.fieldName} width={width} advancedModeOnly={formEle.advancedModeOnly}>
      <FormElementLabel label={formEle.label!} labelHint={formEle.labelHint} />
      <div className="mt-2 pl-1">
        {formEle.options.map((option, indexOption) => (
          <div key={option.value} className="mb-2">
            <input
              type="radio"
              value={option.value}
              name={formEle.fieldName}
              checked={element[formEle.fieldName] == option.value}
              disabled={!!(option.disabled || formEle.disabled)}
              className={`${!isValid && touched ? 'bg-red-600 text-red-600' : 'bg-gray-200 text-prussian-blue-500'} mr-2 border-transparent focus:border-gray-500 focus:text-prussian-blue-600 focus:ring-prussian-blue-600`}
              onChange={event => handleChange(formEle.fieldName, event.target.value)}
              onBlur={() => setTouched(true)}
            />
            <span className={option.disabled || formEle.disabled ? 'text-gray-300 cursor-not-allowed' : ''}>{option.label}</span>
            {option.hint && (
              <BasicRadioInfoIcon fieldId={fieldId} indexOption={indexOption} optionHint={option.hint} />
            )}
          </div>
        ))}
      </div>
      <ValidatorsContainer formEle={formEle} element={element} fieldId={fieldId} touched={touched} setIsValidForField={setIsValidForField} />
    </FormEleContainer>
  )
}, (prevProps, nextProps) => prevProps.element[prevProps.formEle.fieldName] == nextProps.element[nextProps.formEle.fieldName])
