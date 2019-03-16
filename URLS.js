const DEBUG_APP =  false; /* ACROSS THE APP */
const DEBUG_CODEPUSH =  false; /* DO NOT CHANGE UNLESS MUST */

const DEBUG_NETWORK = false; /* FOR ALL NETWORK REQUEST */

const PREFIX = DEBUG_NETWORK ? 'http://127.0.0.1:65534' : 'https://www.mycampusdock.chat';

const STAGING_CODEPUSH_IOS = 'GR8qw12ifVw7B4RN3IEoR_qeCOM-efea177c-2876-4bb3-b267-0f984d263df9';
const PRODUCTION_CODEPUSH_IOS = 'QrWsuGXRWMG1qRssWKnZkNp2SkGHefea177c-2876-4bb3-b267-0f984d263df9';

const PRODUCTION_CODEPUSH_ANDROID = 'K_wFyHZ3yj_EnWoSTza8UZ3c8UAOefea177c-2876-4bb3-b267-0f984d263df9';
const STAGING_CODEPUSH_ANDROID = 'pbYZHXQzHzXWda7aHGCwfbSuZMeKefea177c-2876-4bb3-b267-0f984d263df9';

const APP_VERSION = 'App Version : 1.6 | CP V1'

const urls = {
  PREFIX,
  DEBUG_APP,
  DEBUG_NETWORK,
  DEBUG_CODEPUSH,
  APP_VERSION,
  CODEPUSH_IOS : DEBUG_CODEPUSH ? STAGING_CODEPUSH_IOS : PRODUCTION_CODEPUSH_IOS,
  CODEPUSH_ANDROID : DEBUG_CODEPUSH ? STAGING_CODEPUSH_ANDROID : PRODUCTION_CODEPUSH_ANDROID,
  GENERAL_TOKEN_URL : PREFIX + '/auth/get-general-token',
  COLLEGE_LIST_URL : PREFIX + '/users/get-college-list',
  RESET_USER_URL : PREFIX + '/auth/reset-user',
  GET_STORY_URL : PREFIX + '/channels/get-story',
  TOP_CHANNELS : PREFIX + '/channels/top',
  FETCH_TRENDING_EVENTS : PREFIX + '/events/user/fetch-trending',
  FETCH_CHANNEL_DATA : PREFIX + '/channels/user/fetch-channel-data',
  FOLLOW_URL : PREFIX + '/channels/user/follow',
  UNFOLLOW_URL : PREFIX + '/channels/user/unfollow',
  GET_CATEGORY_CHANNEL_URL : PREFIX + '/channels/get-category-channels',
  FETCH_EVENT_DATA : PREFIX + '/events/user/fetch-event-data',
  SET_USER_INTERESTED : PREFIX + '/events/user/interested',
  SET_ENROLLED : PREFIX + '/events/user/enroll',
  GET_EVENT_LIST : PREFIX + '/events/user/get-event-list',
  FETCH_ACTIVITY_LIST : PREFIX + '/channels/fetch-activity-list',
  UPDATE_READ : PREFIX + '/channels/update-read',
  FETCH_NOTIFICATIONS : PREFIX + '/notifications/user/fetch',
  UPDATE_STORY_VIEWS : PREFIX + '/channels/update-story-views',
  UPDATE_CHANNEL_VISITS : PREFIX + '/channels/update-channel-visits',
  UPDATE_ACTION_TAKEN : PREFIX + '/channels/update-action-taken',
  PUT_LOGS : PREFIX + '/auth/put-logs',
  PUT_TRACKS : PREFIX + '/auth/put-tracks',
  GET_TAG : PREFIX + '/channels/user/collect-tag',
  UPDATE_USER : PREFIX + '/auth/update-user-data',
  REACT_STORY : PREFIX + '/channels/user/react',
};

export default urls;
