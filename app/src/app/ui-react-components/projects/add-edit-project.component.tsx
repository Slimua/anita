import { ANITA_URLS, URL_PARAMS } from 'app/anita-routes/anita-routes.constant'
import { dbInstances } from 'app/data/local-dbs/db-instances.const'
import { LOCAL_STORAGE_SYSTEMS } from 'app/data/local-dbs/local-storage-systems.enum'
import {
  ProjectSettings,
  RESERVED_AUDS_KEYS,
  Section,
  SystemData
  } from 'app/data/project-structure/project-info'
import { IdCreator } from 'app/libs/id-creator/id-creator.class'
import { isProjectLoaded } from 'app/libs/project-helpers/project-handlers/is-project-loaded.function'
import { REDUX_ACTIONS } from 'app/libs/redux/redux-actions.const'
import { storeDispatcher } from 'app/libs/redux/store-dispatcher.function'
import { EDITOR_MODE } from 'app/ui-react-components/editor-mode.enum'
import { FormProjectManager } from 'app/ui-react-components/projects/add-edit-project-components/form-project-manager.component'
import { ProjectEditorModeToggle } from 'app/ui-react-components/projects/add-edit-project-components/project-editor-mode-toggle.component'
import { Loader } from 'app/ui-react-components/shared-components/loader/loader.component'
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

export const AddEditProject = () => {

  const params = useParams();
  const mode = params[URL_PARAMS.projectId] ? EDITOR_MODE.edit : EDITOR_MODE.add;

  const projectId = params[URL_PARAMS.projectId];

  const [project, setProject] = useState<SystemData | null | undefined>(null);

  useEffect(() => {
    let isMounted = true;

    // in add mode, sets a new project
    if (mode === EDITOR_MODE.add)
      return setProject({
        [RESERVED_AUDS_KEYS._settings]: [{ id: IdCreator.random(), title: '', description: '', createdAt: '', localStorage: LOCAL_STORAGE_SYSTEMS.IndexedDB }],
        [RESERVED_AUDS_KEYS._sections]: [{ id: IdCreator.random(), title: '', formModel: [{} as any] }],
      });


    const fetchEProject = async () => {
      const canProceed = await isProjectLoaded(projectId);
      if (!projectId || !canProceed)
        return setProject(undefined);

      const _settings = await dbInstances[projectId].callSelector<ProjectSettings>(RESERVED_AUDS_KEYS._settings).multiple();
      const _sections = await dbInstances[projectId].callSelector<Section>(RESERVED_AUDS_KEYS._sections).multiple();

      if (isMounted)
        setProject({ _settings, _sections });
    };

    if (isMounted)
      fetchEProject();

    return () => { isMounted = false; }
  }, [mode, projectId]);

  if (project === undefined)
    return <Navigate to={ANITA_URLS.projectsList} />

  const headerText = mode === EDITOR_MODE.add ? 'Add Project' : 'Edit Project';

  storeDispatcher({ type: REDUX_ACTIONS.setFormProject, payload: project });

  return (
    <span>
      <div className="p-4 bg-white rounded shadow flex">
        <div>
          <h3 className="text-xl font-bold">{headerText}</h3>
        </div>
        {project !== null && <ProjectEditorModeToggle />}
      </div>
      {project === null && <Loader />}
      {project !== null && <FormProjectManager />}
    </span>
  )

};
