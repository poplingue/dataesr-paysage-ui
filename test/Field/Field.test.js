import * as nextRouter from 'next/router'
import React from 'react'
import Field from '../../components/Field'
import { render, screen } from '../test-utils'

nextRouter.useRouter = jest.fn()
nextRouter.useRouter.mockImplementation(() => ({
    route: '/create/person',
    pathname: '/create/person',
}))

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}))

describe('Field component', () => {
    const setState = jest.fn()

    beforeEach(() => {
        React.useState.mockImplementation(init => [init, setState])
        render(
            <Field
                label="Field"
                index={1}
                parentsection="Section"
                title="Field"
                value="Content field"
            >
                <p>Test</p>
            </Field>
        )
    })

    it('should render the Delete field button', () => {
        expect(screen.getByTestId('btn-delete-field')).toBeVisible()
    })
})
