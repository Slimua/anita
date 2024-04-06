import { ISectionElement } from 'app/models/section-element/section-element.declarations'
import { IOption } from 'app/models/parent-element/parent-element.class'
import { IBasicSelect, ICommonFormEleProps, IOptionKeysModel } from 'app/components/shared-components/forms-automator/form-automator.types'
import { FormEleContainer } from 'app/components/shared-components/forms-automator/form-layout/form-ele-container.component'
import { FormElementLabel } from 'app/components/shared-components/forms-automator/form-layout/form-element-label.component'
import { ValidatorsContainer } from 'app/components/shared-components/forms-automator/form-validation/validators-container.component'
import { useValidators } from 'app/components/shared-components/forms-automator/hooks/use-validators.hook'
import uniqueId from 'lodash/uniqueId'
import React, {
  memo,
  useEffect,
  useRef,
  useState
} from 'react'
import Select, { SingleValue } from 'react-select'
import { WordpressHelper } from 'app/libs/cloud-sync/wordpress/wordpress-helper.class'
import { WORD_PRESS_ROLE_WEIGHT } from 'app/libs/cloud-sync/wordpress/wordpress.const'

export const RemoteSelector: React.FC<ICommonFormEleProps<IBasicSelect<ISectionElement>>> = memo(function RemoteSelector ({ formEle, element, handleChange }: ICommonFormEleProps<IBasicSelect<ISectionElement>>) {
  const [selectOptions, setSelectOptions] = useState<Array<IOptionKeysModel>>([])

  const [touched, setTouched] = useState(false)
  const { current: fieldId } = useRef(uniqueId(formEle.fieldName))
  const [isValid, setIsValidForField] = useValidators(fieldId)

  useEffect(() => {
    let isMounted = true

    const getSelectOptions = async () => {
      const connectedRemotes = await WordpressHelper.instance.getAllRemotesInfo()
      if (connectedRemotes?.length > 0) {
        const options: Array<IOptionKeysModel> = connectedRemotes.filter(remote => {
          const userRole = remote.data.user_role as keyof typeof WORD_PRESS_ROLE_WEIGHT
          const minimumRoleToCreate = remote.data.can_create_projects_role as keyof typeof WORD_PRESS_ROLE_WEIGHT
          const userCanCreate = WORD_PRESS_ROLE_WEIGHT[userRole] >= WORD_PRESS_ROLE_WEIGHT[minimumRoleToCreate]
          return userCanCreate
        }).map(remote => ({
          label: remote.data.site_name,
          value: remote.remoteId
        }))
        if (isMounted && options) {
          setSelectOptions(options)
        }
      }
    }

    if (isMounted) {
      getSelectOptions()
    }

    return () => {
      isMounted = false
    }
  }, [formEle.options])

  const handleChangeInParentsSelector = (newValue: SingleValue<IOption>) => {
    handleChange(formEle.fieldName, newValue!.value)
  }

  if (selectOptions.length === 0) {
    return null
  }

  return (
    <FormEleContainer width="w-full">
      <FormElementLabel label={formEle.label!} labelHint={formEle.labelHint} />
      <Select
        defaultValue={element[formEle.fieldName]}
        name={formEle.fieldName}
        options={selectOptions}
        className={!isValid && touched ? 'border border-red-600 rounded' : ''}
        onChange={handleChangeInParentsSelector}
        onBlur={() => setTouched(true)}
      />
      <ValidatorsContainer formEle={formEle} element={element} fieldId={fieldId} touched={touched} setIsValidForField={setIsValidForField} />
    </FormEleContainer>
  )
}, (prevProps, nextProps) => (
  prevProps.element[prevProps.formEle.fieldName] === nextProps.element[nextProps.formEle.fieldName]
))
