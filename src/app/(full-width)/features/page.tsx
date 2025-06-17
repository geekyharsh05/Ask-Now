import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description:
      "Create professional surveys in minutes with our intuitive drag-and-drop builder. No technical skills required.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Users,
    title: "Targeted Reach",
    description:
      "Reach your exact audience with advanced targeting options and distribution channels across multiple platforms.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Get instant insights with powerful analytics and beautiful visualizations that update in real-time.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with GDPR compliance, data encryption, and secure hosting to protect your data.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Multi-language support and global infrastructure to reach audiences anywhere in the world.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Perfect mobile experience ensures high response rates across all devices and screen sizes.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export default function FeaturesPage() {
  return (
    <main className="overflow-hidden">
      {/* Background Effects */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute right-0 top-0 w-60 rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:-5%_-50%]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-36 pb-16">
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <AnimatedGroup variants={transitionVariants}>
              <div className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                <span className="text-foreground text-sm">
                  Powerful Features
                </span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedGroup>

            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]"
            >
              Everything You Need to Succeed
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground"
            >
              From creation to insights, we've built every feature you need to
              run successful surveys and make data-driven decisions with
              confidence.
            </TextEffect>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-border/50 bg-background/50 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-zinc-950/5 dark:hover:shadow-zinc-950/20"
              >
                <div
                  className={`inline-flex rounded-xl ${feature.bgColor} p-3 mb-6`}
                >
                  <feature.icon className={`size-6 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-foreground transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-5 group-hover:bg-gradient-to-r group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10" />
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <AnimatedGroup variants={transitionVariants}>
            <div className="rounded-3xl border border-border/50 bg-background/50 p-12 backdrop-blur-sm">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Ready to Get Started?
              </TextEffect>

              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.2}
                as="p"
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Join thousands of businesses already using our platform to
                gather insights and make better decisions.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.4,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="flex flex-col items-center justify-center gap-4 md:flex-row"
              >
                <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-8 text-base"
                  >
                    <Link href="/">
                      <span className="text-nowrap">Start Building</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-10.5 rounded-xl px-8"
                >
                  <Link href="/">
                    <span className="text-nowrap">View Pricing</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </main>
  );
}
