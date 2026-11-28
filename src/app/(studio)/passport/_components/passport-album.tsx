import Image from "next/image";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";

import { passportInformation } from "./passport-description";
import { PassportImageDialog } from "./passport-image-dialog";

export function PassportAlbum() {
  const { album } = passportInformation;
  const previewUrl = getPublicImageUrl(album.preview.image.objectKey);

  return (
    <SiteSection aria-labelledby="passport-album-title">
      <SiteContainer>
        <h2 id="passport-album-title">{album.title}</h2>
        <div>
          <div>
            <p>{album.lead}</p>
            <p>{album.description}</p>
            <ul>
              {album.points.map((point) => (
                <li key={point.title}>
                  <strong>{point.title}</strong>
                  <p>{point.description}</p>
                </li>
              ))}
            </ul>
            <p>{album.conclusion}</p>
          </div>
          <figure>
            <PassportImageDialog preview={album.preview} imageUrl={previewUrl}>
              <Image
                src={previewUrl}
                alt={album.preview.image.alt}
                width={album.preview.image.width}
                height={album.preview.image.height}
                className="h-auto max-w-full"
              />
            </PassportImageDialog>
            <figcaption>{album.caption}</figcaption>
          </figure>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
