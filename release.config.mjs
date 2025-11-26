/**
 * @type {import("semantic-release").GlobalConfig}
 */
export default {
  branches: [
    "main",
    {
      name: "alpha",
      prerelease: true,
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        // eslint-disable-next-line no-template-curly-in-string
        successCmd: "echo \"new-release-published=true\" >> $GITHUB_OUTPUT && echo \"new-release-version=${nextRelease.version}\" >> $GITHUB_OUTPUT",
      },
    ],
    "@semantic-release/git",
    [
      "@semantic-release/github",
      {
        assets: [],
      },
    ],
  ],
};
