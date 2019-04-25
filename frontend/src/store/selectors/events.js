import { createSelector } from "reselect";

const getEvents = state => state.events;

export const getShedule = createSelector(
  [getEvents],
  (events) => {
    let result = [];
    let eventsArray = [];
    Object.keys(events).forEach((eventId) => {
      eventsArray.push(Object.assign({id: eventId}, events[eventId], {date: new Date(events[eventId].date)}));
    });
    eventsArray.sort((a, b) => {
      return (a.date > b.date) ? 1 : -1;
    });
    let resultIndex = 0;
    for (let i = 0; i < eventsArray.length; i++) {
      if (!result[resultIndex]) {
        result[resultIndex] = [eventsArray[i]];
        continue;
      }
      if (result[resultIndex][0].date.getDate() === eventsArray[i].date.getDate()) {
        result[resultIndex].push(eventsArray[i]);
      } else {
        resultIndex++;
        i--;
      }
    }
    result.forEach((day) => { day.unshift(day[0].date.toISOString()) });

    function transpose(a) {
      // Calculate the width and height of the Array
      var w = a.length || 0;
      var h = Math.max.apply(Math, a.map(function (el) { return el.length }))
      // In case it is a zero matrix, no transpose routine needed.
      if(h === 0 || w === 0) { return []; }
      /**
       * @var {Number} i Counter
       * @var {Number} j Counter
       * @var {Array} t Transposed data is stored in this array.
       */
      var i, j, t = [];
      // Loop through every item in the outer array (height)
      for(i = 0; i < h; i++) {
        // Insert a new row (array)
        t[i] = [];
        // Loop through every item per item in outer array (width)
        for(j = 0; j < w; j++) {
          // Save transposed data.
          t[i][j] = a[j][i];
        }
      }
      return t;
    }
    result = transpose(result);
    return result;
  }
);