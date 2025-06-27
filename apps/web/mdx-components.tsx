import { slugify } from "@/components/mdx";
import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1
        id={slugify(props.children as string)}
        className="scroll-m-20 text-xl font-bold"
      >
        {props.children as ReactNode}
      </h1>
    ),
    h2: (props) => (
      <h2
        id={slugify(props.children as string)}
        className="mt-10 scroll-m-20 text-lg font-bold"
      >
        {props.children as ReactNode}
      </h2>
    ),
    h3: (props) => (
      <h3
        id={slugify(props.children as string)}
        className="text-md mt-8 scroll-m-20 font-bold"
      >
        {props.children as ReactNode}
      </h3>
    ),
    p: (props) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {props.children as ReactNode}
      </p>
    ),
    ul: (props) => (
      <ul className="mt-4 list-disc pl-8">{props.children as ReactNode}</ul>
    ),
    ol: (props) => (
      <ol className="mt-4 list-decimal pl-8">{props.children as ReactNode}</ol>
    ),
    a: (props) => (
      <Link
        className="underline decoration-primary decoration-2 underline-offset-[4.5px]"
        {...(props as LinkProps)}
      >
        {props.children as ReactNode}
      </Link>
    ),
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-full rounded-sm"
        alt={props.alt ?? "Image"}
      />
    ),
  };
}
