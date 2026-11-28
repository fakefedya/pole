import "server-only";

import { getPublicMediaBaseUrl } from "@/lib/storage/public-media-config";

const publicDocumentKeyPattern =
  /^(?:site|portfolio|products)\/(?:[a-z0-9-]+\/)*[a-zA-Z0-9-]+\.pdf$/;

export const getPublicDocumentUrl = (objectKey: string): string => {
  if (objectKey.length > 240 || !publicDocumentKeyPattern.test(objectKey)) {
    throw new Error("Invalid public document object key");
  }

  return `${getPublicMediaBaseUrl()}/${objectKey}`;
};
