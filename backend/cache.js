const NodeCache = require('node-cache');

// Cache with 1 hour TTL (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

module.exports = cache;
