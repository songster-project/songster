var settings = require('./settings');

// MongoDB settings for dev and dokku production
exports.db = process.env.MONGODB_DATABASE || 'songster';
exports.db_host = process.env.MONGODB_HOST || 'localhost';
exports.db_port = process.env.MONGODB_PORT || '27017';
exports.db_user = process.env.MONGODB_USERNAME;
exports.db_pass = process.env.MONGODB_PASSWORD;

exports.elasticSearch_url = process.env.ELASTICSEARCH_URL || 'localhost:9200';

if (process.env.MONGODB_USERNAME != null && process.env.MONGODB_PASSWORD != null) {
    exports.mongo_url = 'mongodb://' + settings.db_user + ':' + settings.db_pass + '@' + settings.db_host + '/' + settings.db;
} else {
    exports.mongo_url = 'mongodb://' + settings.db_host + '/' + settings.db;
}

exports.cookie_secret = 'changeme';