# gatsby-plugin-umami
[![npm](https://img.shields.io/npm/v/@marcnuri/gatsby-plugin-umami)](https://www.npmjs.com/package/@marcnuri/gatsby-plugin-umami)

Gatsby plugin to add Google Analytics support to your site leveraging Google's [gtag.js](https://developers.google.com/tag-platform/gtagjs) library.

The main difference with the official Gatsby plugins is that this one doesn't use cookies to track visitors.

## Usage

```javascript
plugins: [
  {
    resolve: '@marcnuri/gatsby-plugin-umami',
    options: {
      src: 'https://analytics.example.com/script.js',
      dataWebsiteId: 'c785dabf-e60d-422c-a2a5-fa737bdf1443'
    }
  },
]
```

| Option           | Description                                                                                                                                                                                                      |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src`*           | URL where the script should be downloaded from.                                                                                                                                                                  |
| `dataWebsiteId`* | The ID for your website. Can be retrieved from the Umami dashboard.                                                                                                                                              |
| `dataHostUrl`    | By default, Umami will send data to wherever the script is located. You can override this to send data to another location.                                                                                      |
|                  |                                                                                                                                                                                                                  |
| `dataDomains`    | If you want the tracker to only run on specific domains, you can add them to your tracker script. This is a comma delimited list of domain names. Helps if you are working in a staging/development environment. |

_* Required fields_

