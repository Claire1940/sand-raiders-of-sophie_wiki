"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CloudLightning,
  Cpu,
  ExternalLink,
  Gamepad2,
  Gift,
  Info,
  Map as MapIcon,
  Package,
  Sparkles,
  Swords,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 外部官方链接按钮（仅外部 URL，不含站内链接）
function ExternalLinkButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4 transition-colors"
    >
      {label}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

// 模块头部（eyebrow + 图标 + 标题 + intro）
function ModuleHeader({
  eyebrow,
  title,
  intro,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="text-center mb-10 md:mb-14 scroll-reveal">
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4
                   bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
      >
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// 风险标签颜色（语义色，非硬编码 hex）
function riskBadgeClass(risk: string): string {
  const r = (risk || "").toLowerCase();
  if (r === "low")
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  if (r === "medium")
    return "bg-amber-500/10 border-amber-500/30 text-amber-400";
  if (r === "high") return "bg-red-500/10 border-red-500/30 text-red-400";
  return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]";
}

// 等级标签颜色（语义色）
function tierBadgeClass(tier: string): string {
  switch (tier) {
    case "S":
      return "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]";
    case "A":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "B":
      return "bg-sky-500/10 border-sky-500/30 text-sky-400";
    case "C":
      return "bg-red-500/10 border-red-500/30 text-red-400";
    default:
      return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]";
  }
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sand-raiders-of-sophie.wiki";

  // Trampler 手风琴展开状态
  const [tramplerExpanded, setTramplerExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "SAND Raiders of Sophie Wiki",
        description:
          "Complete SAND: Raiders of Sophie Wiki covering Trampler builds, loot routes, weapons, PvPvE survival, extraction tips, maps, and contracts for the open-world extraction shooter on Steam, PS5, and Xbox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "SAND: Raiders of Sophie - Open-World PvPvE Extraction Shooter",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "SAND Raiders of Sophie Wiki",
        alternateName: "SAND: Raiders of Sophie",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "SAND: Raiders of Sophie Wiki - Builds, Loot & Tramplers",
        },
        sameAs: [
          "https://sand-game.com/",
          "https://store.steampowered.com/app/1431300/SAND_Raiders_of_Sophie/",
          "https://discord.gg/8mYZnNFHJp",
          "https://www.reddit.com/r/SANDgame/",
          "https://x.com/sandthegame",
        ],
      },
      {
        "@type": "VideoGame",
        name: "SAND: Raiders of Sophie",
        gamePlatform: ["PC", "Steam", "PlayStation 5", "Xbox Series X|S"],
        applicationCategory: "Game",
        genre: ["Extraction Shooter", "PvPvE", "Survival", "Open World", "Mech"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 90,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1431300/SAND_Raiders_of_Sophie/",
        },
      },
      {
        "@type": "VideoObject",
        name: "SAND: Raiders of Sophie Launch Trailer | Out Now On Steam",
        description:
          "Official SAND: Raiders of Sophie launch trailer showcasing the Trampler walking fortress, the desert planet Sophie, and PvPvE extraction gameplay.",
        uploadDate: "2026-06-22",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/zkH4dKTLfr4",
        url: "https://www.youtube.com/watch?v=zkH4dKTLfr4",
      },
    ],
  };

  // Tools Grid 卡片 -> section id 映射（8 张卡与 8 个模块锚点一一对应）
  const sectionIds = [
    "release-date-and-platforms",
    "codes-and-rewards",
    "beginner-guide",
    "trampler-builds",
    "weapons-tier-list",
    "game-modes",
    "map-loot-extraction",
    "system-requirements",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1431300/SAND_Raiders_of_Sophie/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，宣传视频置于首屏之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="zkH4dKTLfr4"
              title="SAND: Raiders of Sophie Launch Trailer | Out Now On Steam"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section（保留，置于 Tools Grid 之后） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Release Date and Platforms */}
      <section
        id="release-date-and-platforms"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.releaseDateAndPlatforms.eyebrow}
            title={t.modules.releaseDateAndPlatforms.title}
            intro={t.modules.releaseDateAndPlatforms.intro}
            icon={Gamepad2}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {t.modules.releaseDateAndPlatforms.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col p-5 md:p-6 bg-card border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-bold text-lg leading-snug">{item.title}</h3>
                  <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/80 mb-2">
                  {item.meta}
                </p>
                <p className="text-sm text-muted-foreground flex-1">
                  {item.description}
                </p>
                <ExternalLinkButton href={item.href} label={item.linkLabel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 模块间阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Codes and Rewards */}
      <section
        id="codes-and-rewards"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.codesAndRewards.eyebrow}
            title={t.modules.codesAndRewards.title}
            intro={t.modules.codesAndRewards.intro}
            icon={Gift}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {t.modules.codesAndRewards.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col p-5 md:p-6 bg-card border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <span className="self-start text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] mb-3">
                  {item.badge}
                </span>
                <h3 className="font-bold text-lg mb-2 leading-snug">{item.title}</h3>
                <div className="mb-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Reward
                  </span>
                  <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                    {item.reward}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  {item.description}
                </p>
                <ExternalLinkButton href={item.href} label={item.linkLabel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.beginnerGuide.eyebrow}
            title={t.modules.beginnerGuide.title}
            intro={t.modules.beginnerGuide.intro}
            icon={BookOpen}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.beginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 4: Trampler Builds and Blueprints (Accordion) */}
      <section
        id="trampler-builds"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.tramplerBuildsAndBlueprints.eyebrow}
            title={t.modules.tramplerBuildsAndBlueprints.title}
            intro={t.modules.tramplerBuildsAndBlueprints.intro}
            icon={Wrench}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.tramplerBuildsAndBlueprints.items.map((item: any, index: number) => {
              const isOpen = tramplerExpanded === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <button
                    onClick={() =>
                      setTramplerExpanded(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-base md:text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.summary}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 md:px-5 pb-5 text-sm md:text-base text-muted-foreground border-t border-border pt-4">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 模块间阅读停顿位 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Weapons and Trampler Parts Tier List */}
      <section
        id="weapons-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.weaponsAndTramplerPartsTierList.eyebrow}
            title={t.modules.weaponsAndTramplerPartsTierList.title}
            intro={t.modules.weaponsAndTramplerPartsTierList.intro}
            icon={Swords}
          />
          <div className="scroll-reveal space-y-6 md:space-y-8">
            {t.modules.weaponsAndTramplerPartsTierList.tiers.map((tier: any, ti: number) => (
              <div key={ti}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl font-black ${tierBadgeClass(tier.tier)}`}
                  >
                    {tier.tier}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold">{tier.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tier.entries.map((entry: any, ei: number) => (
                    <div
                      key={ei}
                      className="p-5 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold">{entry.name}</h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${riskBadgeClass(entry.risk)}`}
                        >
                          {entry.risk}
                        </span>
                      </div>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-2">
                        {entry.type}
                      </span>
                      <p className="text-sm text-muted-foreground mb-2">{entry.role}</p>
                      {entry.detail && (
                        <div className="flex items-start gap-1.5 mb-2 p-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.2)]">
                          <Info className="w-3.5 h-3.5 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {entry.detail}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        <span className="text-[hsl(var(--nav-theme-light))] font-medium">
                          {t.modules.weaponsAndTramplerPartsTierList.earlyUseLabel}:
                        </span>{" "}
                        {entry.earlyUse}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Voyage and Storm Dive Modes (Comparison) */}
      <section
        id="game-modes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.voyageAndStormDiveModes.eyebrow}
            title={t.modules.voyageAndStormDiveModes.title}
            intro={t.modules.voyageAndStormDiveModes.intro}
            icon={CloudLightning}
          />
          <div className="scroll-reveal space-y-4 md:space-y-5">
            {t.modules.voyageAndStormDiveModes.rows.map((row: any, ri: number) => {
              const headers = t.modules.voyageAndStormDiveModes.tableHeaders;
              const fields = [
                { label: headers.style, value: row.style },
                { label: headers.risk, value: row.risk },
                { label: headers.loot, value: row.loot },
                { label: headers.timer, value: row.timer },
                { label: headers.extraction, value: row.extraction },
                { label: headers.crew, value: row.crew },
              ];
              return (
                <div
                  key={ri}
                  className="p-5 md:p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)]">
                      <CloudLightning className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <h3 className="text-lg md:text-xl font-bold">{row.mode}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {fields.map((f, fi) => (
                      <div key={fi}>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                          {f.label}
                        </p>
                        <p className="text-sm">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <p className="text-xs uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-0.5 font-medium">
                      {headers.bestFor}
                    </p>
                    <p className="text-sm">{row.bestFor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 7: Map, Loot, and Extraction (Card List) */}
      <section
        id="map-loot-extraction"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.mapLootAndExtraction.eyebrow}
            title={t.modules.mapLootAndExtraction.title}
            intro={t.modules.mapLootAndExtraction.intro}
            icon={MapIcon}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {t.modules.mapLootAndExtraction.items.map((item: any, index: number) => {
              const labels = t.modules.mapLootAndExtraction.fieldLabels;
              return (
                <div
                  key={index}
                  className="flex flex-col p-5 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-base md:text-lg mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <div className="space-y-2.5 text-sm flex-1">
                    <div className="flex items-start gap-2">
                      <MapIcon className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {labels.mapFeature}
                        </span>
                        <p>{item.mapFeature}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {labels.lootFocus}
                        </span>
                        <p>{item.lootFocus}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {labels.dangerSignals}
                        </span>
                        <p>{item.dangerSignals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Anchor className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {labels.extractionMove}
                        </span>
                        <p>{item.extractionMove}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 8: System Requirements and Anti-Cheat (Checklist) */}
      <section
        id="system-requirements"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.systemRequirementsAndAntiCheat.eyebrow}
            title={t.modules.systemRequirementsAndAntiCheat.title}
            intro={t.modules.systemRequirementsAndAntiCheat.intro}
            icon={Cpu}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {t.modules.systemRequirementsAndAntiCheat.groups.map((group: any, gi: number) => (
              <div
                key={gi}
                className="p-5 md:p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <h3 className="font-bold text-base md:text-lg">{group.group}</h3>
                </div>
                <ul className="space-y-2">
                  {group.checks.map((check: string, ci: number) => (
                    <li key={ci} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/8mYZnNFHJp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/sandthegame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1431300"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1431300/SAND_Raiders_of_Sophie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
