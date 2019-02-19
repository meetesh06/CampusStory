
const hottestImage = require('../../media/topics/hot.webp');
const musicImage = require('../../media/topics/music.webp');
const sagImage = require('../../media/topics/sag.webp');
const dadImage = require('../../media/topics/dad.webp');
const communityImage = require('../../media/topics/community.webp');
const foodImage = require('../../media/topics/food.webp');
const funImage = require('../../media/topics/fun.webp');

const foodImageAlt = require('../../media/topics/food-small.webp');
const musicImageAlt = require('../../media/topics/music-small.webp');
const sagImageAlt = require('../../media/topics/sag-small.webp');
const dadImageAlt = require('../../media/topics/dad-small.webp');
const funImageAlt = require('../../media/topics/fun-small.webp');
const communityImageAlt = require('../../media/topics/community-small.webp');

export const categoriesNew = {
  cs: hottestImage,
  food: foodImage,
  mad: musicImage,
  art: dadImage,
  society: communityImage,
  sports: sagImage,
  fun: funImage,
};

export const categoriesNoHottest = [
  {
    title: 'Food',
    value: 'food',
    image: foodImageAlt
  },
  {
    title: 'Music and Dance',
    value: 'mad',
    image: musicImageAlt
  },
  {
    title: 'Art and Theater',
    value: 'art',
    image: dadImageAlt
  },
  {
    title: 'Society',
    value: 'society',
    image: communityImageAlt
  },
  {
    title: 'Sports',
    value: 'sports',
    image: sagImageAlt
  },
  {
    title: 'Fun',
    value: 'fun',
    image: funImageAlt
  }
];