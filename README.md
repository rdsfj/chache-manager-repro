Small reproduction for problems with concurrent inserts in `cache-manager@5`.

Run it:

```
npm ci
npm test
```

All tests run several concurrent inserts using `Cache.wrap()`.
'Concurrent' in the node.js async/ await sense on the event loop.
The first test fails, when I'd expect it to succeed.
Apparently, this behaviour appeared with version 5 of `cache-manager`.
The second test succeeds, because the cache has been set explicitely before the concurrent inserts.
