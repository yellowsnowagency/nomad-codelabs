import Image from "next/image";
import type { Shot } from "@/app/lib/products";

function DeviceFrame({ shot, index }: { shot: Shot; index: number }) {
  return (
    <figure className="device-gallery-item group">
      <div className="device-gallery-frame">
        <div
          className="device-gallery-glow"
          aria-hidden
        />
        <div className="device-gallery-bezel">
          <Image
            src={shot.src}
            alt={shot.caption}
            width={420}
            height={900}
            className="device-gallery-image"
            sizes="(max-width: 768px) 72vw, (max-width: 1200px) 33vw, 280px"
          />
        </div>
        <span className="device-gallery-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <figcaption className="device-gallery-caption">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

function DeviceGallery({ shots }: { shots: Shot[] }) {
  return (
    <div className="device-gallery">
      <div className="device-gallery-track">
        {shots.map((shot, i) => (
          <DeviceFrame key={shot.src} shot={shot} index={i} />
        ))}
      </div>
    </div>
  );
}

function ScreenShot({ shot }: { shot: Shot }) {
  return (
    <figure className="group">
      <div className="showpiece">
        <Image
          src={shot.src}
          alt={shot.caption}
          width={1440}
          height={900}
          className="w-full h-auto block transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-5 flex items-start gap-3 text-[13px] leading-relaxed text-[var(--ink-dim)]">
        <span className="text-[var(--accent)] mt-[2px]">—</span>
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export default function ProductGallery({ shots }: { shots: Shot[] }) {
  const isDevice = shots.every((s) => s.kind === "device");

  if (isDevice) {
    return <DeviceGallery shots={shots} />;
  }

  return (
    <div className={`grid gap-8 ${shots.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {shots.map((s) => (
        <ScreenShot key={s.src} shot={s} />
      ))}
    </div>
  );
}
