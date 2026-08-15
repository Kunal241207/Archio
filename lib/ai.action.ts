import puter from "@heyputer/puter.js";
import { ARCHIO_RENDER_PROMPT } from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read blob as data URL"));
        reader.readAsDataURL(blob);
    });
};

export const generate3DView = async ({sourceImage}: Generate3DViewParams) => {
    const dataUrl = sourceImage.startsWith("data:") ? sourceImage : await fetchAsDataUrl(sourceImage);

    const separatorIndex = dataUrl.indexOf(",");
    const header = separatorIndex === -1 ? "" : dataUrl.slice(0, separatorIndex);
    const base64data = separatorIndex === -1 ? "" : dataUrl.slice(separatorIndex + 1);
    const mimeType = header.replace(/^data:/, "").split(";")[0];

    if (!base64data || !mimeType.startsWith("image/")) {
        throw new Error("Invalid image payload");
    }

    const response = await puter.ai.txt2img(ARCHIO_RENDER_PROMPT, {
        provider: "gemini",
        model: "gemini-3.1-flash-lite-image",
        input_image: base64data,
        input_image_mime_type: mimeType,
        ratio: {w: 1024, h: 1024},
    })

    const rawImageUrl = (response as HTMLImageElement).src ?? null;

    if (!rawImageUrl) {
        return {renderedImage: null, renderedPath: undefined};
    }

    const renderedImage = rawImageUrl.startsWith("data:") ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);

    return {renderedImage, renderedPath: undefined};
}