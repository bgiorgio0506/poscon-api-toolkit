import { AxiosResponse } from "axios";
import { HttpClientError } from "./errors";


    /**
     * @param {string} url
     * @param {string} method
     * @param {any} data
     * A general purpose http request using axios
     */
    export async function request(url: string, method: string, data?: any): Promise<AxiosResponse> {
        const axios = require("axios");

        if (method === "POST"){
            const qs = require("qs");
            data = qs.stringify(data);
        }

        const response = await axios({
            method,
            url,
            data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
        });

        if (response.status !== 200) {
            throw new HttpClientError(response.data, response.status);
        }
        return response;
    }
