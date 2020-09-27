---
lastModified: '2020-09-26'
---

# Versioning your index for Cloudfront

## TL;DR

If you don't want to [invalidate](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html) your index file in Cloudfront, you can make the _Default Root Object_ to point to a new index.$version.html everytime the index itself or any of the assets linked to it (assets) is changed.

- You can do it manually (boring!)
- Or put this line as part of your CD:

    ```bash
    aws cloudfront update-distribution --default-root-object "/index.$version.html"
    ```

I assume you don't use index.html or anything similar in your url, do you?

This is only if you don't want to use [Cloudfront invalidations](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html) for any reason. eg: because AWS says it can incur extra costs.

-------

**Long version of the post**

> Disclaimer: You don't have to read what follows, but it's what people usually do when they write blog posts: write a long and usually boring introduction with the section that matters at the end. If you are in a hurry, the _TL; DR_ is all you need, if you have 5 minutes free, read on, you might find this one interesting.


Time has come when I had to play with CI and CD once I felt comfortable with the state of my last web project, so I started to dive into the web to see what are the (current) best practices. Helped with some tools like [GTmetrix](https://gtmetrix.com/) or [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) you can find how ~~fast~~ slow your site loads (besides other things) so you start doing something to be a little less embarrassed. Using a CND is a very good way to improve the load time of your website, so here I will discuss a little about AWS Cloudfront.

Let me tell how a request to an app using Cloudfront looks like:

    Browser -> Cloudfront -> Origin -> Cloudfront -> Browser

or if you are "lucky" to hit a cached but potentially stale *object*:

    Browser -> Cloudfront -> Browser

Now, the problem of being lucky, is that you might end with an outdated copy of the object when Cloudfront doesn't know the origin (eg: S3) was updated, and these are some of the ways to avoid that:

- Using `Cache-Control` in the origin: You can specify for how long an object is valid in the CDN (Cloudfront) through `s-maxage=<number of seconds>`. Don't want to go deep here, so please google/duckduckgo `s-maxage` if needed
- Specify the cache duration in Cloudfront
- File versioning (my favourite)

Let's say you go with versioning too, so you need to put a hash in your asset files, and indeed, if you are using (for example) webpack, chances are you already have those files with hashes in its names. You may have something like this:

        index.html
        js/my.123456.js
        css/my.0303456.css

Now let's say you have set the [_Default Root Object_](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html) in Cloudfront to be index.html, and already redirected your DNS to point www.your-domain.com to $whatever.cloudfront.com (a CNAME record) so everytime you visit your page, it happens the following:

- Your browser asks the DNS resolver what is the IP of www.your-domain.com
- DNS knows it needs to resolve *$whatever.cloudfront.com* instead (because of the CNAME) and gives the browser the IP of the proxy/CDN/Cloudfront
- The browser requests _index.html_ to Cloudfront using the IP returned by the resolver
- Cloudfront requests _index.html_ to the origin and caches it
- Cloudfront sends _index.html_ back to your browser
- Your browser sees there are 2 links in the html header so makes two more requests to Cloudfront
- ...

What happens if you discover a bug 1 minute after the deployment, takes you 1 minute to fix it, and you deploy again in 1 minute to the origin? Chances are, you set a cache longer than 3 minutes for the index.html in Cloudfront, so you will get an old versión of such a file when you visit www.your-domain.com again.

The fastest solution? Invalidate the cache with Cloudfront:

```bash
aws cloudfront create-invalidation --distribution-id "$YOUR_DISTRIBUTION_ID" --paths "/index.html"
```

As I said, AWS warns you to do it as it can incur costs, but I think it's still the most practical solution.

An alternative is to version the index.html file and you can do it as follows:

- Upload a new index.$version.html to your origin
- Tell cloudfront to use the new _Default Root Object_:

    ```bash
    aws cloudfront update-distribution --default-root-object "/index.$version.html"
    ```

EOF
