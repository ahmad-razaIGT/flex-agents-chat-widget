import axios from "axios";

export async function sendMessage(baseUrl: string, flowId: string, chat_inputs: string, message: string, input_type: string, output_type: string, sessionId: React.MutableRefObject<string>, output_component?: string, tweaks?: Object, api_key?: string, additional_headers?: { [key: string]: string }) {
    let parsedChatInputs: { [key: string]: string } = JSON.parse(chat_inputs);

    // Dynamically set the "query" field with the message and leave other fields as empty strings
    let chatData = {
        ...parsedChatInputs, // Copy all keys from parsedChatInputs
        query: message, // Set "query" key's value to the message
        ...Object.keys(parsedChatInputs).reduce((acc: { [key: string]: string }, key) => {
          if (key !== 'query') acc[key] = ""; // Set all other fields to an empty string
          return acc;
        }, {}),
      };

    let data: any = {
      chatData, // Pass the constructed chatData object
    };

    if (tweaks) {
        data["tweaks"] = tweaks
    }
    if (output_component) {
        data["output_component"] = output_component;
    }
    let headers: { [key: string]: string } = { "Content-Type": "application/json" }
    if (api_key) {
        headers["x-api-key"] = api_key;
    }
    if (additional_headers) {
        headers = Object.assign(headers, additional_headers);
        // headers = {...headers, ...additional_headers};
    }
    if (sessionId.current && sessionId.current != "") {
        data.session_id = sessionId.current;
    }
    let response = axios.post(`${baseUrl}/chats/widget?flowId=${flowId}`, data, { headers });
    return response;
}