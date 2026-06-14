import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
    { next: { revalidate: 60 * 60 * 24 * 30 } },
  ).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2)'\)/);
  if (!match?.[1]) throw new Error(`Could not load font: ${family}`);

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function AppleIcon() {
  const [outfit, bricolage] = await Promise.all([
    loadGoogleFont("Outfit", 700),
    loadGoogleFont("Bricolage+Grotesque", 200),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: 40,
          border: "1px solid rgba(250,250,247,0.12)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 34,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#7DB0FF",
            boxShadow: "0 0 18px #7DB0FF",
          }}
        />
        <div
          style={{
            fontFamily: "Outfit",
            fontSize: 72,
            fontWeight: 700,
            color: "#7DB0FF",
            letterSpacing: "-0.08em",
            lineHeight: 1,
          }}
        >
          //
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: "Bricolage Grotesque",
            fontSize: 11,
            fontWeight: 200,
            letterSpacing: "0.28em",
            color: "#555550",
            textTransform: "uppercase",
          }}
        >
          Nomad Codelabs
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfit, style: "normal", weight: 700 },
        { name: "Bricolage Grotesque", data: bricolage, style: "normal", weight: 200 },
      ],
    },
  );
}
