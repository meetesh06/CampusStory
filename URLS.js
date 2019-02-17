const DEBUG =  false;
const PREFIX = DEBUG ? 'http://127.0.0.1:65534' : 'https://www.mycampusdock.com';
const urls = {
  GENERAL_TOKEN_URL : PREFIX + '/auth/get-general-token',
  COLLEGE_LIST_URL : PREFIX + '/users/get-college-list',
  RESET_USER_URL : PREFIX + '/auth/reset-user',
  GET_STORY_URL : PREFIX + '/channels/get-story',
  TOP_CHANNELS : PREFIX + '/channels/top',
  FETCH_POPULAR_ACTIVITY : PREFIX + '/channels/fetch-popular-activity',
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
  PUT_LOGS : PREFIX + '/auth/put-logs',
  PUT_TRACKS : PREFIX + '/auth/put-tracks'
};

export default urls;
