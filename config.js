/**
 * config
 */

var path = require('path');

var config = {
  // Used for local debugging when debug is true
  debug: false,

  get mini_assets() { return !this.debug; }, // Whether to enable static file merge compression, see Loader in view

  name: 'Caire Beauty Community', // The community name
  description: 'Caire Beauty Community', // The community description
  keywords: 'Caire Beauty, Community, skincare',

  // html head information
  site_headers: [
    '<meta name="author" content="huang87924@gmail.com" />'
  ],
  site_logo: '/public/images/cnodejs_light.svg', // logo
  site_icon: '/public/images/cnode_icon_32.png', // icon
  // Navi bar
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    [ '/about', 'About' ]
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // Static file stores domain names
  // Community domain name
  host: 'localhost',
  // Google tracker ID, for more：http://www.google.com/analytics/
  google_tracker_id: '',
  // cnzz tracker ID
  cnzz_tracker_id: '',

  // mongodb 
  db: 'mongodb://heroku_ckf8s2j9:i10qmc679kh34s3hocva1qfp1e@dbh11.mlab.com:27117/heroku_ckf8s2j9',

  // redis 
  // redis://h:p645ff027bdde2301cc3b6a919bc4acf125944e67770aead2ed113f932fad02dc@ec2-54-211-0-35.compute-1.amazonaws.com:24589
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_password: '87924395Hu',

  redis:{
    port:6379,
    host:'127.0.0.1',
    db:0,
    password:'87924395Hu'
  } || process.env.REDIS_URL,


  session_secret: 'node_club_secret', // must change
  auth_cookie_name: 'node_club',

  // port
  port: 3000 || process.env.PORT,

  // The number of topics displayed in the topic list
  list_topic_count: 20,

  // RSS
  rss: {
    title: 'Caire Beauty Community',
    link: '',
    language: 'en-uk',
    description: 'Caire Beauty Community',
    //max RSS Item number
    max_rss_items: 50
  },

  log_dir: path.join(__dirname, 'logs'),

  // Email
  mail_opts: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'club@126.com',
      pass: 'club'
    },
    ignoreTLS: true,
  },

  //weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // admin access. Set user_login_name as yours
  admins: { user_login_name: true },

  // github 
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback'
  },
  // Whether direct registration is allowed
  allow_sign_up: true,

  // oneapm 
  oneapm_key: '',

  // Upload

  // qiniu upload access
  qn_access: {
    accessKey: 'your access key',
    secretKey: 'your secret key',
    bucket: 'your bucket name',
    origin: 'http://your qiniu domain',
    // If the VPS are abroad, use http://up.qiniug.com/ 
    uploadURL: 'http://xxxxxxxx',
  },

  // upload
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  // tab
  tabs: [
    ['share', 'Share'],
    ['ask', 'Question'],
  ],

  // j-push
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // Number of topics per user per day
  create_reply_per_day: 1000, // Number of repleys per user per day
  create_user_per_ip: 1000, // The number of times each IP can be registered per day
  visit_per_day: 1000, // Number of times per IP can be accessed per day
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/node_club_test';
}

module.exports = config;
