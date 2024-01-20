export function defineCancelAPIObject(apiObject) {
    // Create an object to hold the cancelation handler
    const cancelAPIObject = {}

    // Iterate over each API property name
    Object.getOwnPropertyNames(apiObject).forEach((apiPropertyName) => {
        // Create the cancellation object
        const cancellationControllerObject = {
            controller: undefined
        }

        // Associate the request cancellation handler with the API property name
        cancelAPIObject[apiPropertyName] = {
            handleRequestCancellation: () => {
                // If the controller already exists, cancel the request
                if (cancellationControllerObject.controller) {
                    // Cancel the request
                    cancellationControllerObject.controller.abort()
                }

                // Generate a new AbortController
                cancellationControllerObject.controller = new AbortController()

                return cancellationControllerObject.controller
            }
        }
    })

    return cancelAPIObject
}
