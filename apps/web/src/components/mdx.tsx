import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TableProps {
  data: {
    headers: string[];
    rows: string[][];
  };
}

function Table({ data }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-left text-sm leading-6">
        <thead className="bg-gray-100">
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 text-gray-800 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomLink({
  href = "",
  children,
  ...props
}: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) {
  const className = "text-primary hover:underline underline-offset-4";

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props} className={className}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props} className={className}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={className}
    >
      {children}
    </a>
  );
}

interface RoundedImageProps extends React.ComponentProps<typeof Image> {
  alt: string;
}

function RoundedImage(props: RoundedImageProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg">
      <Image
        {...props}
        className={`w-full h-auto rounded-lg ${props.className ?? ""}`}
      />
    </div>
  );
}

export function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

const headingStyle = (level: number) => {
  const base = "scroll-mt-24 mt-4 font-bold tracking-tight";
  switch (level) {
    case 1:
      return `${base} text-4xl lg:text-5xl`;
    case 2:
      return `${base} text-3xl lg:text-4xl`;
    case 3:
      return `${base} text-2xl lg:text-3xl`;
    case 4:
      return `${base} text-xl lg:text-2xl`;
    case 5:
      return `${base} text-lg`;
    case 6:
      return `${base} text-base`;
  }
};

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children as string);

    return React.createElement(
      `h${level}`,
      { id: slug, className: headingStyle(level) },
      [
        <a
          key={slug}
          href={`#${slug}`}
          className="group inline-flex items-center gap-2"
        >
          <span>{children}</span>
          <span className="opacity-0 group-hover:opacity-100 text-gray-400 text-xs transition-opacity">
            #
          </span>
        </a>,
      ]
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

interface IframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
}

function Iframe({ src, ...props }: IframeProps) {
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={src}
        className="h-full w-full"
        frameBorder="0"
        allowFullScreen
        {...props}
      />
    </div>
  );
}

function Paragraph(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>
) {
  return (
    <p className="my-5 leading-relaxed text-gray-800" {...props}>
      {props.children}
    </p>
  );
}

function UnorderedList(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>>
) {
  return (
    <ul className="list-disc pl-6" {...props}>
      {props.children}
    </ul>
  );
}

function OrderedList(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLOListElement>>
) {
  return (
    <ol className="list-decimal pl-6" {...props}>
      {props.children}
    </ol>
  );
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  Table,
  iframe: Iframe,
};

interface CustomMDXProps {
  source: string;
  components?: Record<string, React.ComponentType<unknown>>;
}

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) } as any}
      source={props.source}
    />
  );
}
