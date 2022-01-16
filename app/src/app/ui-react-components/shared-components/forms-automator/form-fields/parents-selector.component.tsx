import { SectionElement } from 'app/data/project-structure/project-info'
import { OptionsForParentsSelector } from 'app/libs/project-helpers/parent-info-form-ele-builder/options-for-parents-selector.class'
import { parentInfoObjToString } from 'app/libs/project-helpers/parent-info-form-ele-builder/parent-info-obj-to-string.function'
import { Option, parentInfoStringToObjForOptionsGroup } from 'app/libs/project-helpers/parent-info-form-ele-builder/parent-info-string-to-obj.function'
import { AnitaStore } from 'app/libs/redux/reducers.const'
import { REDUX_ACTIONS } from 'app/libs/redux/redux-actions.const'
import { storeDispatcher } from 'app/libs/redux/store-dispatcher.function'
import { IBasicSelect, ICommonFormEleProps, OptionKeysModelGroup } from 'app/ui-react-components/shared-components/forms-automator/form-automator.types'
import { FormEleContainer } from 'app/ui-react-components/shared-components/forms-automator/form-layout/form-ele-container.component'
import { FormElementLabel } from 'app/ui-react-components/shared-components/forms-automator/form-layout/form-element-label.component'
import { ValidatorsContainer } from 'app/ui-react-components/shared-components/forms-automator/validators/validators-container.component'
import uniqueId from 'lodash/uniqueId'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Select, { MultiValue } from 'react-select'

export const ParentsSelector = ({ formEle, element, handleChange }: ICommonFormEleProps<IBasicSelect<SectionElement>>) => {

  const [selectOptions, setSelectOptions] = useState<Array<OptionKeysModelGroup>>([]);
  const project = useSelector((state: AnitaStore) => state.project);

  const [touched, setTouched] = useState(false);
  const { current: fieldId } = useRef(uniqueId(formEle.fieldName))
  const validStore = useSelector((store: AnitaStore) => store.formElesValidState);
  const isInValid = Object.keys(validStore).some(key => key.startsWith(fieldId) && validStore[key] === false);

  useEffect(() => {
    return () => {
      storeDispatcher({ type: REDUX_ACTIONS.unsetValidStateForEle, payload: fieldId });
    }
  }, [fieldId]);

  useEffect(() => {
    let isMounted = true;

    const getSelectOptions = async () => {
      const options = await new OptionsForParentsSelector(project, formEle.options).buildOptions();

      if (isMounted)
        setSelectOptions(options);
    };


    if (isMounted)
      getSelectOptions();

    return () => { isMounted = false };
  }, [project, formEle.options]);

  const handleChangeInParentsSelector = (newValue: MultiValue<Option>) => {
    handleChange(formEle.fieldName, parentInfoObjToString(newValue as Array<Option>));
  }

  if (selectOptions.length === 0)
    return null;

  // We uas as any because react-select does not export the values we'd like to use,
  // and the ones we define are not compatible.
  return (<FormEleContainer width="w-full">
    <FormElementLabel label={formEle['label']} />
    <Select
      defaultValue={parentInfoStringToObjForOptionsGroup(element[formEle.fieldName], selectOptions as any)}
      isMulti
      name={formEle.fieldName}
      options={selectOptions as any}
      className={isInValid && touched ? "border border-red-600 rounded" : ""}
      onChange={handleChangeInParentsSelector}
      onBlur={() => setTouched(true)}
    />
    <ValidatorsContainer formEle={formEle} element={element} fieldId={fieldId} touched={touched} />
  </FormEleContainer>
  )
};