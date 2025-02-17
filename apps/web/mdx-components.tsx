import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

const getId = (title: ReactNode | string): string =>
  title!
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1
        id={getId(props.children as ReactNode)}
        className="scroll-m-20 text-xl font-bold"
      >
        {props.children as ReactNode}
      </h1>
    ),
    h2: (props) => (
      <h2
        id={getId(props.children as ReactNode)}
        className="mt-10 scroll-m-20 text-lg font-bold"
      >
        {props.children as ReactNode}
      </h2>
    ),
    h3: (props) => (
      <h3
        id={getId(props.children as ReactNode)}
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
        className="decoration-yellow underline decoration-2 underline-offset-[4.5px]"
        {...(props as LinkProps)}
      >
        {props.children as ReactNode}
      </Link>
    ),
    img: (props) => (
      <Image
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-full rounded-sm"
        {...(props as ImageProps)}
      />
    ),
  };
}
