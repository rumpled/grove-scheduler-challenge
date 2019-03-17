##### Why Vue?

It's what Grove uses.  Seemed like the ideal choice.



##### Why show everything?

Using a cron schedule you can always interpolate all instances of a scheduled run.  Given any moment in time, you're always between the last and next run so it just made sense to always display those to give a sense of context but use colors to draw attention to things within the desired time window.



##### Axios over fetch

https://medium.com/@sahilkkrazy/fetch-vs-axios-http-request-c9afa43f804e



##### Why colors?

To provide meaningful contextual display without parsing text.  Brighter = closer to now.



##### Things I learned:

* tree shaking
* components
* js scoping and scope hoisting
* context binding



##### What would I work on next?

* Sortable table
* Default sort order
* Real-time updates of last/next time
* Realtime updates of color or some sort of bar-scale countdown to when an event is actually going to happen
* Polling for updates to source data
* Change highlighting