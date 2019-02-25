
const musicImage = require('../../media/topics/music.webp');
const sagImage = require('../../media/topics/sag.webp');
const dadImage = require('../../media/topics/dad.webp');
const communityImage = require('../../media/topics/community.webp');
const foodImage = require('../../media/topics/food.webp');
const funImage = require('../../media/topics/fun.webp');
const techImage = require('../../media/topics/sat.webp');
const fashionImage = require('../../media/topics/fashion.webp');
const businessImage = require('../../media/topics/cal.webp');

const foodImageAlt = require('../../media/topics/food-small.webp');
const musicImageAlt = require('../../media/topics/music-small.webp');
const sagImageAlt = require('../../media/topics/sag-small.webp');
const dadImageAlt = require('../../media/topics/dad-small.webp');
const funImageAlt = require('../../media/topics/fun-small.webp');
const communityImageAlt = require('../../media/topics/community-small.webp');
const techImageAlt = require('../../media/topics/sat-small.webp');
const fashionImageAlt = require('../../media/topics/fashion-small.webp');
const businessImageAlt = require('../../media/topics/cal-small.webp');

export const categoriesNew = {
  food: foodImage,
  mad: musicImage,
  art: dadImage,
  society: communityImage,
  sports: sagImage,
  fun: funImage,
  tech : techImage,
  fashion : fashionImage,
  business : businessImage
};

export const categories = [
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
  },
  {
    title: 'Technology',
    value: 'tech',
    image: techImageAlt
  },
  {
    title: 'Fashion',
    value: 'fashion',
    image: fashionImageAlt
  },
  {
    title: 'Business',
    value: 'business',
    image: businessImageAlt
  }
];