import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Target,
  Users,
  Lightbulb,
  Award,
  Globe,
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

const values = [
  {
    icon: Heart,
    title: "User-Centric Design",
    description:
      "Every feature we build puts our users first. We believe technology should be intuitive, accessible, and empowering.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Target,
    title: "Data-Driven Decisions",
    description:
      "We practice what we preach. Every product decision is backed by real user data and feedback.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We're constantly pushing boundaries to make survey creation and data collection more powerful and accessible.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "From startups to enterprises, we're democratizing insights and helping organizations worldwide make better decisions.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "2M+", label: "Surveys Created" },
  { number: "25M+", label: "Responses Collected" },
  { number: "150+", label: "Countries Served" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former product lead at Google, passionate about making data accessible to everyone.",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-founder",
    bio: "Ex-Meta engineer with 10+ years building scalable platforms that millions rely on.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Elena Volkov",
    role: "Head of Design",
    bio: "Award-winning designer who believes beautiful interfaces drive better user experiences.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
];

export default function AboutPage() {
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
                <span className="text-foreground text-sm">About AskNow</span>
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
              Democratizing Data for Everyone
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground"
            >
              We believe every organization, regardless of size, should have
              access to powerful data collection tools. That's why we built
              AskNow—to make professional surveys accessible to everyone.
            </TextEffect>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-muted/30">
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
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedGroup variants={transitionVariants}>
            <div className="text-center mb-16">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Our Story
              </TextEffect>
            </div>

            <div className="prose prose-lg mx-auto dark:prose-invert">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.2}
                as="p"
                className="text-lg text-muted-foreground leading-relaxed mb-6"
              >
                In 2019, our founders were frustrated by the complexity and cost
                of existing survey tools. As product managers and engineers at
                major tech companies, they saw firsthand how powerful data
                collection could be—but also how inaccessible it was to smaller
                organizations.
              </TextEffect>

              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.4}
                as="p"
                className="text-lg text-muted-foreground leading-relaxed mb-6"
              >
                They set out to change that. Working nights and weekends from a
                small apartment in San Francisco, they built the first version
                of AskNow—a survey platform that was both powerful enough for
                enterprises and simple enough for anyone to use.
              </TextEffect>

              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.6}
                as="p"
                className="text-lg text-muted-foreground leading-relaxed"
              >
                Today, AskNow serves over 50,000 users across 150 countries,
                from solo entrepreneurs to Fortune 500 companies. But our
                mission remains the same: democratize access to
                professional-grade data collection tools and help everyone make
                better decisions.
              </TextEffect>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h2"
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Our Values
            </TextEffect>
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.2}
              as="p"
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              These principles guide everything we do, from product development
              to customer support.
            </TextEffect>
          </div>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="grid gap-8 md:grid-cols-2"
          >
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-border/50 bg-background/50 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-zinc-950/5 dark:hover:shadow-zinc-950/20"
              >
                <div
                  className={`inline-flex rounded-xl ${value.bgColor} p-3 mb-6`}
                >
                  <value.icon className={`size-6 ${value.color}`} />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-foreground transition-colors">
                  {value.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>
    </main>
  );
}
