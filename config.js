const path = require('path')

module.exports = {
  title: 'Whoan',
  description: '',
  themeConfig: {
    repo: 'whoan/vuepress-theme-canvas',

    // Optional options for generating "Edit this page" link

    // if your docs are in a different repo from your main project:
    docsRepo: 'whoan/blog-posts',
    docsDir: 'posts/',
    // defaults to true, set to false to disable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Edit this page!',

    // Custom property to show links about you
    usefulLinks: [
      {
        href: 'https://stackoverflow.com/cv/japrofile',
        cssIcon: 'fa fa-fw fa-stack-overflow'
      },
      {
        href: 'https://github.com/whoan',
        cssIcon: 'fa fa-fw fa-github'
      },
      {
        href: 'https://www.linkedin.com/in/juan-eugenio-abadie-19797933',
        cssIcon: 'fa fa-fw fa-linkedin'
      }
    ]
  }
}
