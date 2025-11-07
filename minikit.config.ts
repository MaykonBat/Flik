const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjE0NDk0ODksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0MzczNzE3NDlFMEEwODExNjQxQUY4QjhDQTExMDVFZDYyYzQzNUREIn0",
    payload:
      "eyJkb21haW4iOiJuZXctbWluaS1hcHAtcXVpY2tzdGFydC1naWx0LXBzaS52ZXJjZWwuYXBwIn0",
    signature:
      "1yZrrD5/pG9Ht4FFHA+DxdMzbO4YFj+XvdIxgMcyCrRRmbEcCbT21zL44zo0M0aUIjkPxKmmCbv33EgYiaZyiRw=",
  },

  miniapp: {
    version: "1",
    name: "Flik",
    subtitle: "Your AI Ad Companion",
    description: "Ads",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/flikLogo.png`,
    splashImageUrl: `${ROOT_URL}/flikLogo.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["marketing", "ads", "quickstart", "waitlist"],
    heroImageUrl: `${ROOT_URL}/flikLogo.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/flikLogo.png`,
  },
} as const;
