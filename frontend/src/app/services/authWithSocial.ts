import axios from "axios";
import { env } from "../../env";

export type VkLoginRequest = {
    code: string;
};

export type VkLoginResponse = {
    access_token: string;
    token_type: string;
};

class VkService {


    static async loginVk(code: VkLoginRequest): Promise<VkLoginResponse> {
        try {
            const response = await axios.post<VkLoginResponse>(
                `${env.BACK_API_URL}/auth/vk?code=${code}`,
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw new Error("Error while making the request");
        }
    }
}


export default VkService;
