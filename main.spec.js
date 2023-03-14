const cacheManager = require('cache-manager');

describe('should use cached values', () => {
  it('should persist first value of concurrent insertions', async () => {
    const cache = await cacheManager.caching('memory');
    const key = 'foo';
    const [value1, value2, value3] = ['v1', 'v2', 'v3'];

    const action1 = jest.fn();
    action1.mockResolvedValue(value1);
    const action2 = jest.fn();
    action2.mockResolvedValue(value2);
    const action3 = jest.fn();
    action3.mockResolvedValue(value3);

    const values = await Promise.all([
      cache.wrap(key, action1),
      cache.wrap(key, action2),
      cache.wrap(key, action3),
    ]);

    // Fails with actual values `['value1', 'value2', 'value3']`.
    // That means all actions have been called once.
    expect(values).toEqual([value1, value1, value1]);
    expect(action1).toHaveBeenCalledTimes(1);
    expect(action2).toHaveBeenCalledTimes(0);
    expect(action3).toHaveBeenCalledTimes(0);
  });

  it('should use cached value after first insertion', async () => {
    const cache = await cacheManager.caching('memory');
    const key = 'foo';
    const value = 'bar';

    const promise = new Promise((resolve) => resolve(value));
    const action = jest.fn(() => promise);

    // Same as above except explicit insertion first.
    // Concurrent inserts below work fine after this.
    const insert = await cache.wrap(key, action);

    const values = await Promise.all([
      cache.wrap(key, action),
      cache.wrap(key, action),
    ]);

    expect(insert).toBe(value);
    expect(values).toEqual([value, value]);
    expect(action).toHaveBeenCalledTimes(1);
  });
});
