const poststylus = require("poststylus")
const rupture = require("rupture")
const autoprefixer = require("autoprefixer")
const rucksack = require("rucksack-css")

module.exports = {
  siteMetadata: {
    title: "blackcater's blog",
    description: "blackcater的个人博客————全栈工程师成长之路",
    website: "http://www.blackcater.win",
    nickname: "blackcater",
    slogan: "一心所向，必有回响",
    email: "blackcater2015@gmail.com",
    socials: [
      {
        type: "twitter",
        url: "",
      },
      {
        type: "facebook",
        url: "",
      },
      {
        type: "google",
        url: "",
      },
      {
        type: "github",
        url: "",
      },
      {
        type: "weibo",
        url: "",
      },
    ],
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/src/pages/`,
      },
    },
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-plugin-stylus",
      options: {
        use: [
          poststylus([
            autoprefixer({
              browsers: ["last 2 versions", "> 1%", "not ie <= 9"],
            }),
            rucksack(),
          ]),
          rupture(),
        ],
      },
    },
    "gatsby-plugin-feed",
    "gatsby-plugin-offline",
    "gatsby-plugin-react-helmet",
  ],
}
