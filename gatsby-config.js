module.exports = {
  plugins: [
    "@unisite/theme-blog",
    {
      resolve: "gatsby-plugin-compile-es6-packages",
      options: { modules: ["@unisite/theme-blog"] },
    },
  ],
};
