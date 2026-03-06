// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Paulo Borges',
  tagline: 'Documentation Engineer & Software Developer',
  favicon: 'img/favicon.svg',
  url: 'https://deflaimun.github.io',
  baseUrl: '/my-docusaurus/',
  organizationName: 'deflaimun',
  projectName: 'my-docusaurus',
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/Deflaimun/my-docusaurus/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      navbar: {
        title: 'Paulo Borges',
        logo: {
          alt: 'Paulo Borges connected nodes logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/docs',
            label: 'About',
            position: 'left',
          },
          {
            to: '/docs/case-studies/shadowing',
            label: 'Case Studies',
            position: 'left',
          },
          {
            to: '/docs/writing-samples/shadowing/',
            label: 'Writing Samples',
            position: 'left',
          },
          {
            href: 'https://www.linkedin.com/in/paulohtb/',
            label: 'LinkedIn',
            position: 'right',
          },
          {
            href: 'https://github.com/Deflaimun',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Portfolio',
            items: [
              {label: 'About', to: '/docs'},
              {label: 'Case Studies', to: '/docs/case-studies/shadowing'},
              {label: 'Writing Samples', to: '/docs/writing-samples/shadowing/'},
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/paulohtb/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Deflaimun',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Paulo Borges. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
