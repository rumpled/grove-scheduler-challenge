<template>
  <div id="app">
    <table v-if="jobs" id="jobsTable">
      <thead>
        <tr>
          <th v-for="column in columnTitles" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in displayData" :key="job.id">
          <td class="jobId">{{ job.id }}</td>
          <td class="jobPrev" :style="job.prevStyle" :title="job.prevTime">
            {{ job.prevTime | moment("from", "now") }}
          </td>
          <td class="jobName">{{ job.attributes.name }}</td>
          <td class="jobNext" :style="job.nextStyle" :title="job.nextTime">
            {{ job.nextTime | moment("from", "now") }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from "vue";

const columnTitles = ["ID", "Last Instance", "Task Name", "Next Instance"];
// eslint-disable-next-line

export default {
  name: "app",
  data: function() {
    return {
      jobs: [],
      columnTitles: columnTitles,
      notifications: []
    };
  },
  computed: {
    displayData: function() {
      // prepare our bounded scaling for colorized display
      var nextScale =
        nextScale ||
        this.$d3 // eslint-disable-line no-unused-vars
          .scaleLinear()
          // how far ahead do we want to highlight?  from now to + seconds from now
          .domain([
            0,
            this.$moment
              .duration(
                parseInt(process.env.VUE_APP_HIGHLIGHTAHEAD_HOURS),
                "hours"
              )
              .asSeconds()
          ])
          .range(["#00ff00", "#ffffff"])
          .clamp(true);
      var prevScale =
        prevScale ||
        this.$d3 // eslint-disable-line no-unused-vars
          .scaleLinear()
          // how far back do we want to highlight?  from negative seconds ago to now
          .domain([
            this.$moment
              .duration(
                parseInt(process.env.VUE_APP_HIGHLIGHTBEHIND_HOURS),
                "hours"
              )
              .asSeconds(),
            0
          ])
          .range(["#ffffff", "#4876ff"])
          .clamp(true);

      // now that we have some jobs data, process it to add our display attributes
      let jobs = this.jobs.map(job => {
        // add the later schedule object for later use. pun intended!
        let schedule = later.parse.cron(job.attributes.cron); // eslint-disable-line no-undef
        // figure out the next time and color w/ intensity to use when displaying
        let nextTime = later.schedule(schedule).next(1); // eslint-disable-line no-undef
        let secondsUntil = this.$moment
          .duration(this.$moment(nextTime).diff(this.$moment()))
          .asSeconds();
        // same for next instance
        let nextColor = this.$d3.color(nextScale(secondsUntil)).hex();
        let prevTime = later.schedule(schedule).prev(1); // eslint-disable-line no-undef
        let secondsSince = this.$moment
          .duration(this.$moment(prevTime).diff(this.$moment()))
          .asSeconds();
        let prevColor = this.$d3.color(prevScale(secondsSince)).hex();

        // and add all our work to the output for rendering
        return Object.assign(job, {
          schedule: schedule,
          nextTime: nextTime,
          secondsUntil: secondsUntil,
          prevTime: prevTime,
          secondsSince: secondsSince,
          nextStyle: { backgroundColor: nextColor },
          prevStyle: { backgroundColor: prevColor }
        });
      });
      return jobs;
    }
  },
  watch: {
    // set up notifications when new jobs are populated
    displayData: function(
      newJobs,
      oldJobs // eslint-disable-line no-unused-vars
    ) {
      // todo: remove prior scheduled notifications when updates happen
      // add new job notifications
      for (let i = 0; i < newJobs.length; i++) {
        let notification = setTimeout(
          function() {
            this.$pushjs.create(
              `${newJobs[i].attributes.name} is starting...`,
              {
                body: `at ${this.$moment(newJobs[i].nextTime).format(
                  "HH:mm:ss on dddd MMM Do"
                )}`,
                requireInteraction: true
              }
            );
          }.bind(this),
          newJobs[i].secondsUntil * 1000
        );
        this.notifications.push(notification);
      }
    }
  },
  methods: {
    // pull sample data and populate in app data
    getSome: function() {
      const url = process.env.VUE_APP_SCHEDULE_ENDPOINT;
      // eslint-disable-next-line
      Vue.axios
        .get(url)
        .then((response) => {this.jobs = response.data.data;});
    }
  },
  created: function() {
    // populate data on app instantiation
    this.getSome();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
#jobsTable {
  border-spacing: 1em;
}
#jobsTable tbody tr td {
  margin: 0 1em;
  border-bottom: 1px dashed #000;
}
</style>
