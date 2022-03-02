# paysage-ui

> Frontend application of new Paysage project.

![Build & Test](https://github.com/poplingue/dataesr-paysage-ui/actions/workflows/tests.yml/badge.svg?branch=main)
![GitHub last commit](https://img.shields.io/github/last-commit/poplingue/dataesr-paysage-ui?color=purple)

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

UI is managed with package [@dataesr/react-dsfr](https://www.npmjs.com/package/@dataesr/react-dsfr)

## Getting Started

Add .env file
```
NEXT_API_URL=''
NEXT_BASE_PATH=''
API_URL=''
API_AUTH_URL=''
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3002](http://localhost:3002)

## Use forms

### Example adding a new field in a form

```bash
# /UpdateStructure/form.json 

{
   "title": "My new field",
   "type": "text | checkbox | multisearch | radio",
   "validatorId": "myValidatorId",
   "staticValues": [...],
 }
```

```bash
# /UpdateStructure/configValidator.json 

myValidatorId: {
    validators: [
        (value) => ({
            valid: value.length > 2,
            errorMsg: 'Au moins 2 caractères',
        }),
    ],
    required: true,
}
```

```bash
# /config/utils.js 

const obj = {
      'update/structure': [
          ...,
          'myNewfield'
      ]
}
```

## Tests

Launch unit tests and watcher

```bash
yarn test
```

### Cypress

To run tests you must export variables:

```bash
export CYPRESS_ACCOUNT=my_account

export CYPRESS_PASSWORD=my_password
```

### With browser

```bash
yarn cy:open 
```

### Without browser

```bash
yarn cy:run 
```

### Record Cypress test

```bash
yarn dev
yarn cy:run-rec
```

Tests in `cypress/integration/paysage/user/**.spec.js` need Mollie Dickinson Inactive and Mollie Dickinson Active users. Be certain to have it in DB for Cypress account tests.

```
{
  email: 'mollie-active.dickinson@email.com',
  firstName: 'Mollie',
  lastName: 'Dickinson',
  username: 'mollie-active',
}

{
  email: 'mollie-inactive.dickinson@email.com',
  firstName: 'Mollie',
  lastName: 'Dickinson',
  username: 'mollie-inactive',
}
```
## IndexDB

IndexDB is used to store data from forms. On each change of value is updated in SERVICE_FORMS database the unique key with the following pattern:

`pathname@[section#id]_[nameId]#[eq]`

:warning: If objectStore names change, version of the database must be updated in `helpers/utils-contants.js`

## Errors handler

ErrorBoundary can be used to catch runtime error. As this feature doesn't work with server side rendering, it must wrapped a NoSSRWrapper component.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Run with Docker

This command will build and run the Docker image "paysage-ui" :

```sh
docker-compose up --build
```

## TODO

* add unit tests for complex components
* add possibility of comments to section/field
* adding link to section/field 
* improve DynamicBreadcrumb system
* add middleware functions for theme
* Forms: compare data from DB and data from IndexDB
  * check validation field
  * check validation section
* https://www.telerik.com/blogs/generating-pdf-html-react-example-exporting-data-grids?utm_medium=cpm&utm_source=reactnewsletter&utm_campaign=kendo-ui-react-awareness-prod-masters-of-the-grid&utm_content=generating-pdf-html&utm_content=blog-generating-pdf-h&ck_subscriber_id=1366272460
* Navigation focus accessibility
