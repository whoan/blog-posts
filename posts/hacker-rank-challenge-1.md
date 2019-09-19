---
lastModified: '2019-04-30'
---

# Hacker Rank challenge #1: Count triplets

I plan to create some blog entries to analyze some interesting exercises from Hacker Rank or similar platforms.

In this first entry, I want to explain how to solve the [Count Triplets challenge](https://www.hackerrank.com/challenges/count-triplets-1) which I found really hard to solve. After trying to solve it on my own with no success (the best solution I got was getting a timeout in 2 test cases), I decided to look for hints on the way to solve it in the Discussion section of the problem.

The problem:

> You are given an array and you need to find number of triplets of indices *(i, j, k)* such that the elements at those indices are in geometric progression for a given common ratio *r* and *i < j < k*. 

Between all the solutions in the comments, the one that caught my attention due to its simplicity, is [this one](https://www.hackerrank.com/challenges/count-triplets-1/forum/comments/484710). This is an adapted version in C++:

```cpp
long countTriplets(const std::vector<long>& source, long ratio) {
  std::unordered_map<long, long> v2, v3;
  long result = 0;

  for (auto value : source) {
    result += v3[value];
    v3[value*ratio] += v2[value];
    ++v2[value*ratio];
  }

  return result;
}
```

Although there are some explanations in the comments in Hacker Rank's page, I still couldn't understand it (and I wasn't the only one it seems). I will try to get to the solution step by step to see if I can help you to understand it too.

---------

## First approach suitable to mortals

For those who didn't understand the solution at first sight (like me), I decided to create an easier to understand version to get to the final version above:

```cpp
long countTriplets(const std::vector<long>& source, double ratio) {
  typedef std::unordered_map<double, long> ContainerType;
  ContainerType is, js, ks;

  for (auto value : source) {

    // if value is the third element in the triplet
    if (js.count(value/ratio)) {
      ks[value] += js[value/ratio]; // step 1
    }

    // if value is the second element in the triplet
    if (is.count(value/ratio)) {
      js[value] += is[value/ratio]; // step 2
    }

    // value is always a candidate to be the first element in a triplet
    ++is[value];                    // step 3
  }

  return std::accumulate(std::begin(ks), std::end(ks), long(0),
    [] (long accumulated, const ContainerType::value_type& pair) {
      return accumulated + pair.second;
    }
  );
}
```

If you are thinking that `ks` is useless, you are completely right but let me use it in this example :)

This is the explanation: for any given value **N**, it can be the third, second, or the first value in a triplet:

- If there is any *value/ratio* already registered in `js`, **N** will be the third element in (at least) one triplet. See **step 1**
- If there is any *value/ratio* already registered in `is`, **N** will *possibly* be the second element in a triplet. See **step 2**
- **N** is *always* a candidate to be the first element in a triplet. No conditions are necessary here.

Let's refactor the solution...

----------------

## First refactor

This refactor is a small change to take advantage of the behavior of c++'s `operator[]`. If the element doesn't exist in the container, it just creates a new one with a value equals to the default-constructed underlying object. In our example it is `long() == 0`. ie: We don't need to check if the element exists beforehand as in the *worst case* it just creates a new element in the container with a value of 0, so adding 0 doesn't hurt at all:

```cpp
long countTriplets(const std::vector<long>& source, double ratio) {
  typedef std::unordered_map<double, long> ContainerType;
  ContainerType is, js, ks;

  for (auto value : source) {
    ks[value] += js[value/ratio];
    js[value] += is[value/ratio];
    ++is[value];
  }

  return std::accumulate(std::begin(ks), std::end(ks), long(0),
    [] (long accumulated, const ContainerType::value_type& pair) {
      return accumulated + pair.second;
    }
  );
}
```

-----------

## Second refactor

Yes, `ks` is useless as we only use it to count the numbers of triplets using as the key the last element in the triplet. As the challenge only asks for the amount of triplets we can just use a regular variable and accumulate the amount of final triplets:


```cpp
long countTriplets(const std::vector<long>& source, double ratio) {
  std::unordered_map<double, long> is, js;
  long count = 0; // new variable to accumulate the number of final triplets

  for (auto value : source) {
    count += js[value/ratio];
    js[value] += is[value/ratio];
    ++is[value];
  }

  return count;
}
```

----------

## Third refactor

Floating-point arithmetic is not that accurate and is more expensive than working with integral numbers, so we can write a version without FP numbers registering the amount of `ks` and `js` that will be in the final triplets if we process `value*ratio` sometime in the future (ie: in another iteration):

```cpp
long countTriplets(const std::vector<long>& source, long ratio) {
  std::unordered_map<long, long> js, ks;
  long count = 0;

  for (auto value : source) {
    count += ks[value];
    ks[value*ratio] += js[value];
    ++js[value*ratio];
  }

  return count;
}
```

------------

## Final comments

If you still don't understand how it works, consider again the version in the second refactor which I think is the easiest to understand:

```cpp
long countTriplets(const std::vector<long>& source, double ratio) {
  std::unordered_map<double, long> is, js;
  long count = 0;

  for (auto value : source) {
    count += js[value/ratio];
    js[value] += is[value/ratio];
    ++is[value];
  }

  return count;
}
```

---------

- You count triplets only when `value` is the third element in the triplet (ie: you already have something in `js[value/ratio]`)
- For any given triplet (A, B, C) in any given time:
  * `is[A]` is the amount of times a value of `A` was processed
  * `js[B]` is the amount of pairs `(A, B)` we can create with the processed elements. eg: being `A=1, B=2`:
    ```
    t1: 1 2 1 1 4   -> is[1] == 3, js[2] == 1
    t2: 1 2 1 1 2 4 -> is[1] == 3, js[2] == 4
    ```

That's all from my side. I hope I help you understand the reasoning of the final solution. Comments? Open an issue on GitHub :) (click on *Edit this page!* below).
