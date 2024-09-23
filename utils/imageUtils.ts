// must be used when we want to access an image hosted on GCP with Next image optimization enabled
// without this, when the image base domain is the same as the frontend, the Next.js server will try to get the image without going through the cloudflare proxy
// and so we will not benefit from the proxy to GCP configured in cloudflare and the image will not be displayed (404)
export const replaceImageBaseUrlWithOriginal = (url: string): string => {
  const gcloudMediaBucketOriginalBaseUrl =
    process.env.NEXT_PUBLIC_GCLOUD_MEDIA_BUCKET_ORIGINAL_BASE_URL ?? "";
  const productImageCdnUrl = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_CDN_URL ?? "";

  if (gcloudMediaBucketOriginalBaseUrl === "" || productImageCdnUrl === "") return url;

  return url.replace(productImageCdnUrl, gcloudMediaBucketOriginalBaseUrl);
};
