/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly NETWORK:string; // e.g. 134
    readonly WEB3_GATEWAY:string; // e.g. https://bellecour.iex.ec
    readonly CONTRACT_TASKRESULT_TX:string; // e.g. 0x24ec48d06ef6498c30f3695ddb545db6a333286b65565d193f46ddc6021d86a5
    readonly CONTRACT_TASKRESULT:string; // e.g. 0xDbEE3804B4a6752a5006CC43985911Fb13e57dD1
    readonly CONTRACT_LLMQUESTION_TX:string; // e.g. 0xb14f5e2beb0ae83d02fdedb70f5adeaf3602390bffbfed57d0c26773aef99dbc
    readonly CONTRACT_LLMQUESTION:string; // e.g. 0x64C858D17D9503179976403deaCB83446198Fb06
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
