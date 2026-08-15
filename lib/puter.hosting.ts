import puter from "@heyputer/puter.js";
import {HOSTING_CONFIG_KEY, HOSTING_DOMAIN_SUFFIX, createHostingSlug, fetchBlobFromUrl, getHostedUrl, getImageExtension, imageUrlToPngBlob, isHostedUrl} from "./utils";

type HostingConfig = {
  subdomain: string;
};

type HostedAsset = { url: string; };

export const getOrCreateHostingConfig = async (): Promise<HostingConfig | null> => {
  try {
    const existing = await puter.kv.get(HOSTING_CONFIG_KEY) as HostingConfig | null;
    if (existing?.subdomain) {
      return { subdomain: existing.subdomain };
    }

    const subdomain = createHostingSlug();
    const created = await puter.hosting.create(subdomain, '.');
    
    const record: HostingConfig = { subdomain: created.subdomain };
    await puter.kv.set(HOSTING_CONFIG_KEY, record);
    
    return record;
  } catch(e) {
    console.error("Failed to create hosting:", e);
    return null;
  }
}

export const uploadImageToHosting = async ({ hosting, url, projectId, label }: StoreHostedImageParams ): Promise<HostedAsset | null> => {
    if (!hosting || !url) return null;
    if (isHostedUrl(url)) return { url };

    try {
        const res = label === "rendered" ? await imageUrlToPngBlob(url).then((blob) => blob ? { blob, contentType: "image/png" } : null) : await fetchBlobFromUrl (url);

        if (!res) return null;

        const contentType = res.contentType || res.blob.type || ""; 
        const extension = getImageExtension(contentType, url);
        const dir = `projects/${projectId}`;
        const filePath = `${dir}/${label}.${extension}`; 

        const uploadFile = new File([res.blob], `${label}.${extension}`, { type: contentType });

        await puter.fs.mkdir(dir, { createMissingParents: true });
        await puter.fs.write(filePath, uploadFile);

        const hostedUrl = getHostedUrl({ subdomain: hosting.subdomain }, filePath);
        return hostedUrl ? { url: hostedUrl } : null;
        
    } catch (error) {
        console.error("Error uploading image to hosting:", error);
        return null;
    }
};