import {h, options, render} from 'preact'
import {expect} from 'chai'

import FieldStringEdit from './FieldStringEdit'

import Label from 'components/Label/Label'
import TextInput from 'components/TextInput/TextInput'

jest.mock('lib/util', () => ({
  getUniqueId: () => 'c-1'
}))

// DOM setup
let $, mount, root, scratch

options.debounceRendering = f => f()

beforeAll(() => {
  $ = sel => scratch.querySelectorAll(sel)
  mount = jsx => root = render(jsx, scratch, root)
  scratch = document.createElement('div')
})

afterEach(() => {
  mount(null).remove()
})

const mockSchema = {
  _id: 'subtitle',
  type: 'String',
  label: 'Sub Heading',
  validation: {},
  required: false,
  publish: {
    section: 'Article',
    placement: 'main'
  }
}

const mockSchemaWithOptions = {
  _id: 'siteType',
  type: 'String',
  label: 'Site type',
  default: 'personal',
  validation: {
    regex: {
      pattern: '[personal|blog|news|commerce|other]'
    }
  },
  required: false,
  publish: {
    section: 'Meta',
    placement: 'sidebar',
    display: {
      list: true,
      edit: true
    },
    readonly: false,
    options: [
      {
        value: 'personal',
        label: 'Personal site'
      },
      {
        value: 'blog',
        label: 'Blog'
      },
      {
        value: 'news',
        label: 'News'
      },
      {
        value: 'commerce',
        label: 'E-commerce'
      },
      {
        value: 'other',
        label: 'Other'
      }
    ]
  }
}

describe('FieldStringEdit component', () => {
  it('has propTypes', () => {
    const component = (
      <FieldStringEdit />
    )

    expect(component.nodeName.propTypes).to.exist
    expect(Object.keys(component.nodeName.propTypes)).to.have.length.above(0)
  })

  describe('if the field schema has `publish.options` set to `true`', () => {
    it('renders a Label', () => {
      const component = (
        <FieldStringEdit
          schema={mockSchemaWithOptions}
        />
      )

      expect(component).to.matchTemplate(
        <Label
          label={mockSchemaWithOptions.label}
        >(...)</Label>
      )
    })

    it('renders a Label with a "Required" comment if the field schema has `required: true`', () => {
      const mockSchemaWithOptionsRequired = {
        ...mockSchemaWithOptions,
        required: true
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithOptionsRequired}
        />
      )

      expect(component).to.matchTemplate(
        <Label
          label={mockSchemaWithOptions.label}
          comment="Required"
        >(...)</Label>
      )
    })

    it('renders a Label with an error message if the `error` prop is a String', () => {
      const component = (
        <FieldStringEdit
          error="Something went kaput"
          schema={mockSchemaWithOptions}
        />
      )

      expect(component).to.matchTemplate(
        <Label
          error={true}
          errorMessage="Something went kaput"
          label={mockSchemaWithOptions.label}
        >(...)</Label>
      )
    })

    it('renders a <select> with an option for each element in the array', () => {
      const component = (
        <FieldStringEdit
          schema={mockSchemaWithOptions}
        />
      )

      expect(component).to.contain(
        <select
          class="dropdown"
          id="c-1"
          inLabel={true}
          multiple={false}
          disabled={false}
          value={mockSchemaWithOptions.default}
        >
          <option
            value=""
            class="dropdown-option"
            disabled
          >Please select {mockSchemaWithOptions.label}</option>

          {mockSchemaWithOptions.publish.options.map(option => (
            <option
              class="dropdown-option"
              value={option.value}
            >{option.label}</option>
          ))}
        </select>
      )
    })

    it('renders a default disabled `<option>` field schema `label` prop', () => {
      const label = 'Foo Bar'
      const mockSchemaWithLabel = Object.assign({}, mockSchemaWithOptions, {label})
      const component = (
        <FieldStringEdit
          schema={mockSchemaWithLabel}
        />
      )

      expect(component).to.contain(
        <select
          class="dropdown"
          id="c-1"
          inLabel={true}
          multiple={false}
          disabled={false}
          value={mockSchemaWithLabel.default}
        >
          <option
            value=""
            class="dropdown-option"
            disabled
          >Please select {label}</option>

          {mockSchemaWithLabel.publish.options.map(option => (
            <option
              class="dropdown-option"
              value={option.value}
            >{option.label}</option>
          ))}
        </select>
      )
    })

    it('renders a default disabled `<option>` without label value if prop does not exist in field schema', () => {
      const label = 'Foo Bar'
      const mockSchemaWithLabel = Object.assign({}, mockSchemaWithOptions)
      delete mockSchemaWithLabel.label
      const component = (
        <FieldStringEdit
          schema={mockSchemaWithLabel}
        />
      )

      expect(component).to.contain(
        <select
          class="dropdown"
          id="c-1"
          inLabel={true}
          multiple={false}
          disabled={false}
          value={mockSchemaWithLabel.default}
        >
          <option
            value=""
            class="dropdown-option"
            disabled
          >Please select</option>

          {mockSchemaWithLabel.publish.options.map(option => (
            <option
              class="dropdown-option"
              value={option.value}
            >{option.label}</option>
          ))}
        </select>
      )
    })

    it('renders a <select> with the selected option being the one passed in the `value` prop', () => {
      const component = (
        <FieldStringEdit
          schema={mockSchemaWithOptions}
          value="blog"
        />
      )

      expect(component).to.contain(
        <select
          class="dropdown"
          id="c-1"
          inLabel={true}
          multiple={false}
          disabled={false}
          value="blog"
        >
          <option
            value=""
            class="dropdown-option"
            disabled
          >Please select {mockSchemaWithOptions.label}</option>

          {mockSchemaWithOptions.publish.options.map(option => (
            <option
              class="dropdown-option"
              value={option.value}
            >{option.label}</option>
          ))}
        </select>
      )
    })

    it('renders a <select> with the `multiple` attribute if `publish.multiple` is true', () => {
      const mockSchemaWithMultipleOptions = {
        ...mockSchemaWithOptions,
        publish: {
          ...mockSchemaWithOptions.publish,
          multiple: true
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithMultipleOptions}
        />
      )

      expect(component).to.contain(
        <select
          class="dropdown dropdown-multiple"
          id="c-1"
          inLabel={true}
          multiple={true}
          disabled={false}
          value={mockSchemaWithOptions.default}
        >
          {mockSchemaWithOptions.publish.options.map(option => (
            <option
              class="dropdown-option"
              value={option.value}
            >{option.label}</option>
          ))}
        </select>
      )
    })

    it('renders a <select> with the `disabled` attribute if `publish.readonly` is true', () => {
      const mockSchemaWithOptionsReadOnly = {
        ...mockSchemaWithOptions,
        publish: {
          ...mockSchemaWithOptions.publish,
          readonly: true
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithOptionsReadOnly}
        />
      )

      expect(component).to.contain(
        <select
          class="dropdown"
          id="c-1"
          inLabel={true}
          disabled={true}
          value={mockSchemaWithOptions.default}
        >
          <option
            value=""
            class="dropdown-option"
            disabled
          >Please select {mockSchemaWithOptions.label}</option>

          {mockSchemaWithOptions.publish.options.map(option => (
            <option
              class="dropdown-option"
              value={option.value}
            >{option.label}</option>
          ))}
        </select>
      )
    })

    it('selects all options in `value` when rendering a multiple <select>', () => {
      const mockSchemaWithMultipleOptions = {
        ...mockSchemaWithOptions,
        publish: {
          ...mockSchemaWithOptions.publish,
          multiple: true
        }
      }

      mount(
        <FieldStringEdit
          schema={mockSchemaWithMultipleOptions}
          value={[
            'personal',
            'news',
            'other'
          ]}
        />
      )

      expect($('option')[0].selected).to.eql(true)
      expect($('option')[1].selected).to.eql(false)
      expect($('option')[2].selected).to.eql(true)
      expect($('option')[3].selected).to.eql(false)
      expect($('option')[4].selected).to.eql(true)
    })

    it('triggers validation if the selected value changes', () => {
      let component

      mount(
        <FieldStringEdit
          ref={c => component = c}
          schema={mockSchemaWithOptions}
        />
      )

      const validateFn = jest.spyOn(component, 'validate')

      component.handleOnChange({
        target: {
          attributes: {
            multiple: false
          },
          nodeName: 'SELECT',
          options: [
            {
              value: 'personal'
            },
            {
              value: 'blog'
            },
            {
              value: 'news'
            },
            {
              value: 'commerce',
              selected: true
            },
            {
              value: 'other'
            }
          ]
        }
      })

      expect(validateFn.mock.calls.length).to.eql(1)
      expect(validateFn.mock.calls[0][0]).to.eql('commerce')
    })

    it('fires the `onChange` callback if the selected value changes', () => {
      const onChange = jest.fn()

      mount(
        <FieldStringEdit
          onChange={onChange}
          schema={mockSchemaWithOptions}
        />
      )

      const $input = $('select.dropdown')[0]

      $input.value = 'commerce'
      $input.dispatchEvent(new Event('change'))

      expect(onChange.mock.calls.length).to.eql(1)
      expect(onChange.mock.calls[0][0]).to.eql(mockSchemaWithOptions._id)
      expect(onChange.mock.calls[0][1]).to.eql('commerce')
    })
  })

  describe('if the field schema does not have `publish.options` set to `true`', () => {
    it('renders a Label', () => {
      const component = (
        <FieldStringEdit
          schema={mockSchema}
        />
      )

      expect(component).to.matchTemplate(
        <Label
          label={mockSchema.label}
        >(...)</Label>
      )
    })

    it('renders a Label with a "Required" comment if the field schema has `required: true`', () => {
      const mockSchemaRequired = {
        ...mockSchema,
        required: true
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaRequired}
        />
      )

      expect(component).to.matchTemplate(
        <Label
          label={mockSchema.label}
          comment="Required"
        >(...)</Label>
      )
    })

    it('renders a Label with an error message if the `error` prop is a String', () => {
      const component = (
        <FieldStringEdit
          error="Something went kaput"
          schema={mockSchema}
        />
      )

      expect(component).to.matchTemplate(
        <Label
          error={true}
          errorMessage="Something went kaput"
          label={mockSchema.label}
        >(...)</Label>
      )
    })

    it('renders a TextInput', () => {
      const component = (
        <FieldStringEdit
          schema={mockSchema}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="text"
          value=""
        />
      )
    })

    it('renders a multiline TextInput if `publish.multiline` is true', () => {
      const mockSchemaWithMultiline = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          multiline: true
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithMultiline}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="multiline"
          rows=""
          resizable={false}
          value=""
        />
      )
    })

    it('renders a static TextInput if `publish.heightType` is static', () => {
      const mockSchemaWithStaticHeight = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          multiline: true,
          heightType: 'static',
          rows: 10
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithStaticHeight}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="multiline"
          rows={10}
          resizable={false}
          heightType="static"
          value=""
        />
      )
    })

    it('renders a full height TextInput if `publish.heightType` is full', () => {
      const mockSchemaWithFullHeight = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          multiline: true,
          heightType: 'full'
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithFullHeight}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="multiline"
          rows=""
          resizable={false}
          heightType="full"
          value=""
        />
      )
    })

    it('renders a content height TextInput if `publish.heightType` is content', () => {
      const mockSchemaWithContentHeight = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          multiline: true,
          heightType: 'content'
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithContentHeight}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="multiline"
          rows=""
          resizable={false}
          heightType="content"
          value=""
        />
      )
    })

    it('renders a resizable TextInput if `publish.resizable` is true', () => {
      const mockSchemaWithResizable = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          multiline: true,
          resizable: true
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithResizable}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="multiline"
          resizable={true}
          rows=""
          value=""
        />
      )
    })

    it('renders a TextInput with 3 rows if `publish.rows` is 3', () => {
      const mockSchemaWithThreeRows = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          multiline: true,
          heightType: 'static',
          rows: 3
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaWithThreeRows}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          type="multiline"
          resizable={false}
          rows={3}
          value=""
        />
      )
    })

    it('renders a disabled TextInput if `publish.readonly` is true', () => {
      const mockSchemaReadOnly = {
        ...mockSchema,
        publish: {
          ...mockSchema.publish,
          readonly: true
        }
      }

      const component = (
        <FieldStringEdit
          schema={mockSchemaReadOnly}
        />
      )

      expect(component).to.contain(
        <TextInput
          id="c-1"
          inLabel={true}
          placeholder={mockSchema.placeholder}
          readonly={true}
          type="text"
          value=""
        />
      )
    })

    it('triggers validation if the value changes', () => {
      let component

      mount(
        <FieldStringEdit
          ref={c => component = c}
          schema={mockSchema}
        />
      )

      const validateFn = jest.spyOn(component, 'validate')

      component.handleOnChange({
        target: {
          nodeName: 'INPUT',
          value: 'Somethin'
        }
      })

      expect(validateFn.mock.calls.length).to.eql(1)
      expect(validateFn.mock.calls[0][0]).to.eql('Somethin')
    })

    it('triggers validation if a key is pressed', () => {
      let component

      mount(
        <FieldStringEdit
          ref={c => component = c}
          schema={mockSchema}
        />
      )

      const validateFn = jest.spyOn(component, 'validate')

      component.handleOnKeyUp({
        target: {
          nodeName: 'INPUT',
          value: 'Something'
        }
      })

      expect(validateFn.mock.calls.length).to.eql(1)
      expect(validateFn.mock.calls[0][0]).to.eql('Something')
    })
  })

  describe('validation', () => {
    it('does not trigger validation until the component has been interacted with, if `forceValidation` is false', () => {
      const mockValidate = jest.fn()

      class MockFieldStringEdit extends FieldStringEdit {
        validate(value) {
          return mockValidate(value)
        }
      }

      let component

      mount(
        <MockFieldStringEdit
          ref={c => component = c}
          schema={mockSchema}
        />
      )

      expect(mockValidate.mock.calls.length).to.eql(0)
    })

    it('triggers validation on mount if `forceValidation` is true', () => {
      const mockValidate = jest.fn()

      class MockFieldStringEdit extends FieldStringEdit {
        validate(value) {
          return mockValidate(value)
        }
      }

      let component

      mount(
        <MockFieldStringEdit
          forceValidation={true}
          ref={c => component = c}
          schema={mockSchema}
        />
      )

      expect(mockValidate.mock.calls.length).to.eql(1)
    })

    describe('when dealing with multiple values', () => {
      it('fires an error via the `onError` callback if the field is required and there are no values selected', () => {
        const onError = jest.fn()
        const mockSchemaWithOptionsRequired = {
          ...mockSchemaWithOptions,
          required: true
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithOptionsRequired}
          />
        )

        component.validate([])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithOptionsRequired._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql([])
      })

      it('fires an error via the `onError` callback if one of the values does not conform to a `minLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchemaWithOptions,
          validation: {
            minLength: 15
          }
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate(['thisOneWillValidate', 'notThisOne'])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql(['thisOneWillValidate', 'notThisOne'])
      })

      it('fires an error via the `onError` callback, with the message set in `message`, if one of the values does not conform to a `minLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchemaWithOptions,
          validation: {
            minLength: 15
          },
          message: 'Oops'
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate(['thisOneWillValidate', 'notThisOne'])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql('Oops')
        expect(onError.mock.calls[0][2]).to.eql(['thisOneWillValidate', 'notThisOne'])
      })

      it('fires an error via the `onError` callback if one of the values does not conform to a `maxLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchemaWithOptions,
          validation: {
            maxLength: 5
          }
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate(['fine', 'notFine'])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql(['fine', 'notFine'])
      })

      it('fires an error via the `onError` callback, with the message set in `message`, if one of the values does not conform to a `maxLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchemaWithOptions,
          validation: {
            maxLength: 5
          },
          message: 'Oops'
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate(['fine', 'notFine'])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql('Oops')
        expect(onError.mock.calls[0][2]).to.eql(['fine', 'notFine'])
      })

      it('fires an error via the `onError` callback if one of the values does not conform to a `regex` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchemaWithOptions,
          validation: {
            regex: {
              pattern: '(one|three|four)'
            }
          }
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate(['one', 'two'])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql(['one', 'two'])
      })

      it('fires an error via the `onError` callback, with the message set in `message`, if one of the values does not conform to a `regex` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchemaWithOptions,
          validation: {
            regex: {
              pattern: '(one|three|four)'
            }
          },
          message: 'Oops'
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate(['one', 'two'])

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql('Oops')
        expect(onError.mock.calls[0][2]).to.eql(['one', 'two'])
      })
    })

    describe('when dealing with a single value', () => {
      it('fires an error via the `onError` callback if the field is required and the value is empty', () => {
        const onError = jest.fn()
        const mockSchemaRequired = {
          ...mockSchema,
          required: true
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaRequired}
          />
        )

        component.validate('')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaRequired._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql('')
      })

      it('fires an error via the `onError` callback if the value does not conform to a `minLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchema,
          validation: {
            minLength: 15
          }
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate('too short')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql('too short')
      })

      it('fires an error via the `onError` callback, with the message set in `message`, if the value does not conform to a `minLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchema,
          validation: {
            minLength: 15
          },
          message: 'Oops'
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate('too short')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql('Oops')
        expect(onError.mock.calls[0][2]).to.eql('too short')
      })

      it('fires an error via the `onError` callback if the value does not conform to a `maxLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchema,
          validation: {
            maxLength: 5
          }
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate('too long')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql('too long')
      })

      it('fires an error via the `onError` callback, with the message set in `message`, if the value does not conform to a `maxLength` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchema,
          validation: {
            maxLength: 5
          },
          message: 'Oops'
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate('too long')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql('Oops')
        expect(onError.mock.calls[0][2]).to.eql('too long')
      })

      it('fires an error via the `onError` callback if the value does not conform to a `regex` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchema,
          validation: {
            regex: {
              pattern: '(one|three|four)'
            }
          }
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate('two')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql(true)
        expect(onError.mock.calls[0][2]).to.eql('two')
      })

      it('fires an error via the `onError` callback, with the message set in `message`, if the value does not conform to a `regex` constraint', () => {
        const onError = jest.fn()
        const mockSchemaWithValidation = {
          ...mockSchema,
          validation: {
            regex: {
              pattern: '(one|three|four)'
            }
          },
          message: 'Oops'
        }

        let component

        mount(
          <FieldStringEdit
            onError={onError}
            ref={c => component = c}
            schema={mockSchemaWithValidation}
          />
        )

        component.validate('two')

        expect(onError.mock.calls.length).to.eql(1)
        expect(onError.mock.calls[0][0]).to.eql(mockSchemaWithValidation._id)
        expect(onError.mock.calls[0][1]).to.eql('Oops')
        expect(onError.mock.calls[0][2]).to.eql('two')
      })
    })
  })
})
