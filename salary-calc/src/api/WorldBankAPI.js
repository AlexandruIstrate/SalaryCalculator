import { api } from "src/api/axios/AxiosConfigs";
import { defineCancelAPIObject } from "src/api/axios/AxiosUtils";

export const WorldBankAPI = {
    getPPPData: async function (start_year, end_year, cancel = false) {
        const response = await api.request({
            url: "/country/all/indicator/PA.NUS.PPP",
            method: "GET",
            // Retrieve the signal value by using the property name
            params: {
                format: "json",
                per_page: 20000,
                source: 2,
                date: `${start_year}:${end_year}`
            },
            signal: cancel ? 
                cancelAPIObject[this.get.name].handleRequestCancellation().signal : 
                undefined
        })

        // Log whether the response was cached
        console.log(`Response ${response.cached ? "WAS" : "WAS NOT"} returned from cache`);

        // Return the result from the API
        return response.data
    }
}

// Define the cancel API object for WorldBankAPI
const cancelAPIObject = defineCancelAPIObject(WorldBankAPI)
