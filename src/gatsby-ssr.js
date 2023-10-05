import React from 'react';

export const onRenderBody = ({
  setPostBodyComponents
}, {
  src,
  dataWebsiteId,
  dataHostUrl = null,
  dataDomains = null,
  // Required for integration test
  getEnv = () => process.env.NODE_ENV
}) => {
  if (getEnv() !== 'production' || !src || !dataWebsiteId) {
    return null;
  }
  const props = {
    src: src,
    'data-website-id': dataWebsiteId
  };
  if (dataHostUrl) {
    props['data-host-url'] = dataHostUrl;
  }
  if (dataDomains) {
    props['data-domains'] = dataDomains;
  }
  const script = <script key='umami' async defer {...props} />;
  return setPostBodyComponents([script]);
};
