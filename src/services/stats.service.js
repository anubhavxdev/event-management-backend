const redis = require("../config/redis");

exports.getCachedCount = async (key, fetchFn, ttl = 60) => {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const freshData = await fetchFn();
  await redis.set(key, JSON.stringify(freshData), "EX", ttl);
  return freshData;
};
