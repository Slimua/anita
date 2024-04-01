/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'app/components/shared-components/common-ui-eles/button.component'
import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { SupportedCloud } from 'app/libs/cloud-sync/cloud-sync-base.class'
import { DropboxHelper } from 'app/libs/cloud-sync/dropbox/dropbox-helper.class'
import { OAuthUtils } from 'app/libs/cloud-sync/o-auth-utils.class'
import { WordpressHelper } from 'app/libs/cloud-sync/wordpress/wordpress-helper.class'
import { ANITA_URLS } from 'app/libs/routing/anita-routes.constant'
import React from 'react'
import { Navigate } from 'react-router-dom'

const onClick = () => {
  // close window
  window.close()
}

export const OAuth: React.FC = () => {
  const data = OAuthUtils.parseQueryString()

  if (!data?.code) {
    return <Navigate to={ANITA_URLS.projectsList} />
  }

  const service = data.service ?? SupportedCloud.DROPBOX
  const label = service === SupportedCloud.WORDPRESS ? 'WordPress' : 'Dropbox'
  const helper = service === SupportedCloud.WORDPRESS ? WordpressHelper.instance : DropboxHelper.instance
  helper.getAccessTokenFromCode(data.code)

  return (
    <div className="container px-0 md:px2 lg:px-5 pt-20 md:pt-24 mx-auto">
      <div className="p-4 lg:w-2/3 mx-auto">
        <div className="h-full bg-white shadow px-8 pt-16 pb-16 rounded-lg overflow-hidden text-center relative">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">Authentication successful</h2>
          <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">{label} connected</h1>
          <p className="leading-relaxed mb-3">You can close this window and go back to Anita.</p>
          <div className="flex justify-center">
            <Button
              id="close"
              label="Close window"
              type={Type.primary}
              size="lg"
              onClick={onClick}
              marginClassName="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
