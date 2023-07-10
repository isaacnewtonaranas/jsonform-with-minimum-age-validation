import moment from 'moment';

const momentFunction:Function = moment || (() => {})

export default {
  errors: [] as any[],
  setupBirthDateField: (uischema: any) => {
    const uischemaCopy = JSON.parse(JSON.stringify(uischema))
    uischemaCopy.elements.forEach((element: any) => {
      if (element.rule?.condition?.schema?.minYears) {
        element.rule.condition.schema.const = 'YYYY-MM-DD'
      }
    })
    return uischemaCopy
  },
  minYears: (
    currentUischema: any,
    currentData: any,
    newData: any,
    minYearsKey: any,
    errors: any[]
  ) => {
    var currentBirthDate = currentData[minYearsKey]
    var newErrors: any[] = [...errors]
    const newBirthDate = newData[minYearsKey]
    if (currentBirthDate !== newBirthDate) {
      currentBirthDate = newBirthDate
      const uischemaCopy = JSON.parse(JSON.stringify(currentUischema))
      uischemaCopy.elements.forEach((element: any) => {
        if (
          element.rule &&
          element.rule.condition &&
          element.rule.condition.schema &&
          element.rule.condition.scope
        ) {
          const { minYears, const: constValue } =
            element.rule.condition.schema
          if (minYears && constValue) {
            const minimumBirthDate = momentFunction()
              .subtract(minYears, 'years')
              .format('YYYY-MM-DD')
            const birthDateAsNumber = momentFunction(currentBirthDate).valueOf()
            const minimumBirthDateAsNumber = momentFunction(minimumBirthDate).valueOf()
            if (minimumBirthDateAsNumber >= birthDateAsNumber) {
              element.rule.condition.schema.const = currentBirthDate
              newErrors = newErrors.filter(
                (error: any) =>
                  error.custom_scope !== element.rule.condition.scope
              )
            } else {
              newErrors.push({
                custom_scope: element.rule.condition.scope,
                custom_message: uischemaCopy.elements.find(
                  (a: any) => a.scope == element.rule.condition.scope
                ).errorMessages?.minYears,
              })
            }
          }
        }
      })
      return {
        minYearsUischema: uischemaCopy,
        minYearsErrors: newErrors,
      }
    }
    return {
      minYearsUischema: currentUischema,
      minYearsErrors: errors,
    }
  },
}
