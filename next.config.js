const path = require('path');
const withSass = require('@zeit/next-sass');
module.exports = withSass({
  /* bydefault config  option Read
  For More Optioshere https://github.com/vercel/next-plugins/tree/master/packages/next-sass */
  cssModules: true
});
module.exports = {
  target: "serverless",
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: "/:any*",
        destination: "/",
      },
    ];
  },
  sassOptions: { includePaths: [path.join(__dirname, 'styles')], },
  reactStrictMode: true,
};
