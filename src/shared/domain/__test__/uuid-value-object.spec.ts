import { InvalidUuidError, Uuid } from "../value-object/uuid.value-object"

class TestUuid extends Uuid {}

describe('UUID Unit test', () => {
  let validateSpy: jest.SpyInstance

  beforeEach(() => {
    validateSpy = jest.spyOn(
      Uuid.prototype as any,
      'validate'
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should call validate when instance is created', () => {
    new TestUuid()

    expect(validateSpy).toHaveBeenCalled()
  })

  test('should throw InvalidUuidError when uuid is invalid', () => {
    expect(() => {
      new TestUuid('invalid-uuid')
    }).toThrow(InvalidUuidError)
  })

  test('should throw error with correct message', () => {
    expect(() => {
      new TestUuid('invalid-uuid')
    }).toThrow('Id must be a valid UUID')
  })

  test('should accept a valid UUID', () => {
    const validUuid = crypto.randomUUID()

    const uuid = new TestUuid(validUuid)

    expect(uuid.id).toBe(validUuid)
  })

  test('should generate a valid UUID when no id is provided', () => {
    const uuid = new TestUuid()

    expect(uuid.id).toBeDefined()

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    expect(uuidRegex.test(uuid.id)).toBe(true)
  })

})
