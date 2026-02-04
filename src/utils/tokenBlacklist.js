const redis = require("../config/redis");

const BLACKLIST_PREFIX = "bl_token:";

exports.blacklistToken = async (token, expiresInSeconds) => {
  await redis.set(
    `${BLACKLIST_PREFIX}${token}`,
    "true",
    "EX",
    expiresInSeconds
  );
};

exports.isTokenBlacklisted = async (token) => {
  const result = await redis.get(`${BLACKLIST_PREFIX}${token}`);
  return !!result;
};
