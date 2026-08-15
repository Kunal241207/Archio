import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

export const signIn = async () => await puter.auth.signIn()

export const signOut = () => puter.auth.signOut()

export const getUser = async () => {
    try{
        return await puter.auth.getUser()
    }
    catch{
        return null
    }
}

export const createProject = async ({item}: CreateProjectParams): Promise<DesignItem | null> => {
    const projectId = item.id;

    const hosting = await getOrCreateHostingConfig();
    if (!hosting) {
        console.error("Failed to get or create hosting config");
        return null;
    }

    const hostedSource = await uploadImageToHosting({
        hosting,
        url: item.sourceImage,
        projectId,
        label: "source"
    });

    if (!hostedSource?.url) {
        console.error("Failed to upload source image for project:", projectId);
        return null;
    }

    const hostedRendered = item.renderedImage ? await uploadImageToHosting({
        hosting,
        url: item.renderedImage,
        projectId,
        label: "rendered"
    }) : null;

    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload: DesignItem = {
        ...rest,
        sourceImage: hostedSource.url,
        renderedImage: hostedRendered?.url || undefined,
    };

    try {
        return payload;
    } catch (error) {
        console.error("Failed to save project:", error);
        return null;
    }
}