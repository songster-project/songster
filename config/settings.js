// MongoDB settings for dev and dokku production
exports.db = process.env.MONGODB_DATABASE || 'songster';
exports.db_host = process.env.MONGODB_HOST || 'localhost';
exports.db_port = process.env.MONGODB_PORT || '27017';
exports.db_user = process.env.MONGODB_USERNAME;
exports.db_pass = process.env.MONGODB_PASSWORD;

exports.cookie_secret = 'changeme';