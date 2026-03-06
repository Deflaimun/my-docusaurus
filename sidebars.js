/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'About',
    },
    {
      type: 'category',
      label: 'Case Studies',
      items: [
        { type: 'doc', id: 'case-studies/shadowing', label: 'Redpanda Disaster Recovery' },
        { type: 'doc', id: 'case-studies/gbac', label: 'Group-Based Access Control (GBAC)' },
      ],
    },
    {
      type: 'category',
      label: 'Writing Samples',
      items: [
        {
          type: 'category',
          label: 'Shadowing (Disaster Recovery)',
          items: [
            { type: 'doc', id: 'writing-samples/shadowing/index', label: 'Introduction' },
            { type: 'doc', id: 'writing-samples/shadowing/overview', label: 'Overview' },
            { type: 'doc', id: 'writing-samples/shadowing/setup', label: 'Configure Shadowing' },
            { type: 'doc', id: 'writing-samples/shadowing/monitor', label: 'Monitor Shadowing' },
            { type: 'doc', id: 'writing-samples/shadowing/failover', label: 'Failover' },
            { type: 'doc', id: 'writing-samples/shadowing/failover-runbook', label: 'Failover Runbook' },
          ],
        },
        {
          type: 'category',
          label: 'Group-Based Access Control (GBAC)',
          items: [
            { type: 'doc', id: 'writing-samples/gbac/overview', label: 'Overview' },
            { type: 'doc', id: 'writing-samples/gbac/configure', label: 'Configure GBAC' },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
