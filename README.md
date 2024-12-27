# dash-event-listening

Contains a custom Dash component called "Dataiku Filter Listener".

Test from the `dataiku_filter_listener/` directory with `python usage.py`.
- This can be done from the GitHub Codespace. When prompted, open the Dash app in a new browser tab.
- From this tab, open the browser console and execute `window.postMessage({k: 'titi'}, '*');`.
- Go back to the Codespace terminal. The Dash app logs will show "Caught event! value is titi".

## Motivation for this component

We want to catch events triggered by Dataiku Dashboard Filters. As explained in the Dataiku documentation (Dashboards » Insights reference » Webapp » [Accessing dashboard filters](https://doc.dataiku.com/dss/latest/dashboards/insights/webapp.html#accessing-dashboard-filters), the Filters post events of type 'message' to the browser `window`. The message event's data contains a `type` property set to 'filters', and a `filters` property containing the actual filter values. We want to access these values from Dash code.

The Dash Extensions library contains an EventListener class (see link below) but it can't be used because it doesn't listen to events at the window level.

## How the component was built

```bash
cookiecutter gh:plotly/dash-component-boilerplate
cd dataiku_filter_listener/
npm install
npm run build
python usage.py
```

From the `dataiku_filter_listener/` directory:

* Added `dash-extensions-js` dependency to package.json
* Installed npm packages with `npm install`
* Wrote DataikuFilterListener.react.js by adapting Dash Extensions' [EventListener.react.js](https://github.com/emilhe/dash-extensions/blob/57c350d861ed484c6210faefcf51d0ff99ee304d/src/lib/components/EventListener.react.js#L8)
* Built with `npm run build`
