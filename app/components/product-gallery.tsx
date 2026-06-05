import Image from "next/image";
import type { Shot } from "@/app/lib/products";

function DeviceShot({ shot }: { shot: Shot }) {
  return (
    <figure className="flex flex-col items-center">
      <div className="relative w-full max-w-[270px]">
        <Image
          src={shot.src}
          alt={shot.caption}
          width={420}
          height={900}
          className="w-full h-auto block drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-[1.2s] ease-out hover:-translate-y-2"
        />
      </div>
      <figcaption className="mt-6 max-w-[260px] text-center text-[13px] leading-relaxed text-[var(--ink-dim)]">
        {shot.caption}
      </figcaption>
    </figure>
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
    return (
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-12 sm:gap-x-16">
        {shots.map((s) => (
          <DeviceShot key={s.src} shot={s} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-8 ${shots.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {shots.map((s) => (
        <ScreenShot key={s.src} shot={s} />
      ))}
    </div>
  );
}
