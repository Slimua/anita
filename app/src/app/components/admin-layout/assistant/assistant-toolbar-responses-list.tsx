import { AssistantToolbarResponsesListItem } from 'app/components/admin-layout/assistant/assistant-toolbar-responses-list-item'
import * as React from 'react'

interface IAssistantToolbarResponsesListProps {
  responses: Array<string>
  queries: Array<string>
}

export const AssistantToolbarResponsesList: React.FC<IAssistantToolbarResponsesListProps> = (props) => {
  if (!props.responses?.length) {
    return null
  }
  return (
    <div className="flex flex-col max-h-full p-4 pt-0 overflow-auto">
      <ul>
        {props.queries.map((query, index) => (
          <AssistantToolbarResponsesListItem key={index} response={props.responses[index]} query={query} />
        ))}
      </ul>
    </div>
  )
}
