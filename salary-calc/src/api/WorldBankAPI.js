import { api } from "src/api/axios/AxiosConfigs";
import { defineCancelAPIObject } from "src/api/axios/AxiosUtils";

export const WorldBankAPI = {
    getPPPData: async function (cancel = false) {
        const response = await api.request({
            url: "/country/all/indicator/PA.NUS.PPP",
            method: "GET",
            // data: allocationBody,
            // Retrieve the signal value by using the property name
            params: {
                format: "json"
            },
            signal: cancel ? 
                cancelAPIObject[this.get.name].handleRequestCancellation().signal : 
                undefined
        })

        // Return the result from the API
        return response.data
    }
}

// Define the cancel API object for WorldBankAPI
const cancelAPIObject = defineCancelAPIObject(WorldBankAPI)
