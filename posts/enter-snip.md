---
lastModified: '2019-11-05'
---

# Insert code snippets in your code from the web

As I love to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) code, I created [this small tool called snip](https://github.com/whoan/snip) to insert code directly from the web into your code with ease. Let me show you an example.

Let's say you have this source file:

```bash
$ cat examples/main.cpp
```
```cpp
//snip("https://raw.githubusercontent.com/whoan/snip/master/examples/snippet.hpp")
int main() {
  say_hello();
  return 0;
}
```

And suppose yor already have the `snip` command available in your system. If you write the following line, it just works:

```bash
$ snip g++ examples/main.cpp && ./a.out
```
```
> Hello World
```

How? Let's first see the content referenced in the *snip line*:

```bash
$ curl https://raw.githubusercontent.com/whoan/snip/master/examples/snippet.hpp
```
```cpp
#ifndef _SNIPPET_HPP
#define _SNIPPET_HPP

#include <iostream>

void say_hello() {
  std::cout << "Hello World\n";
}

#endif
```

So, all `snip` does is to download the snippet, write the content in a cache (located in `~/.cache/snip`) for future use, and create a temporary file (in `/tmp`) with the content of the source file with the snippet included after the *snip line*. In summary, it creates a file like this:

```bash
$ cat /tmp/tmp.qER7nXdnlj.cpp
```
```cpp
//snip("https://raw.githubusercontent.com/whoan/snip/master/examples/snippet.hpp")
#ifndef _SNIPPET_HPP
#define _SNIPPET_HPP

#include <iostream>

void say_hello() {
  std::cout << "Hello World\n";
}

#endif
int main() {
  say_hello();
  return 0;
}
```

So your line:

```bash
$ snip g++ examples/main.cpp
```

Becomes:

```bash
$ g++ /tmp/tmp.qER7nXdnlj.cpp
```

That's all. No magic, no wisdom. Just another tool you might find useful in your daily tasks. You can see [this code](https://github.com/whoan/challenges/blob/master/min-coin-change/bottom-up.cpp) as a real use example.
