// const artImage = require('../../media/topics/art.webp');
const hottestImage = require('../../media/topics/hot.webp');
// const calImage = require('../../media/topics/cal.webp');
const musicImage = require('../../media/topics/music.webp');
// const satImage = require('../../media/topics/sat.webp');
const sagImage = require('../../media/topics/sag.webp');
const dadImage = require('../../media/topics/dad.webp');
// const fashionImage = require('../../media/topics/fashion.webp');
// const photographyImage = require('../../media/topics/photography.webp');
// const halImage = require('../../media/topics/hal.webp');
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
  art: dadImage,
  mad: musicImage,
  society: communityImage,
  sports: sagImage,
  fun: funImage,
};

// export const categories = [
//   {
//     title: 'Art',
//     value: 'art',
//     image: artImage
//   },
//   {
//     title: 'Career and Literature',
//     value: 'cal',
//     image: calImage
//   },
//   {
//     title: 'Music',
//     value: 'music',
//     image: musicImage
//   },
//   {
//     title: 'Science and Tech',
//     value: 'sat',
//     image: satImage
//   },
//   {
//     title: 'Sports and Gaming',
//     value: 'sag',
//     image: sagImage
//   },
//   {
//     title: 'Dance and Drama',
//     value: 'dad',
//     image: dadImage
//   },
//   {
//     title: 'Fashion',
//     value: 'fashion',
//     image: fashionImage
//   },
//   {
//     title: 'Photography',
//     value: 'photography',
//     image: photographyImage
//   },
//   {
//     title: 'Health and Lifestyle',
//     value: 'hal',
//     image: halImage
//   },
//   {
//     title: 'Community',
//     value: 'community',
//     image: communityImage
//   }
// ];
export const categoriesNoHottest = [
  {
    title: 'Food',
    value: 'food',
    image: foodImageAlt
  },
  {
    title: 'Art',
    value: 'art',
    image: dadImageAlt
  },
  {
    title: 'Music and Dance',
    value: 'mad',
    image: musicImageAlt
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

// export const categoryIcon = {
//   music: musicImageAlt
// };
