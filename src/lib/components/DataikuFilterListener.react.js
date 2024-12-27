import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDescendantProp } from 'dash-extensions-js'

/**
 * The DataikuFilterListener component listens for events from the document object or children if provided.
 */
export default class DataikuFilterListener extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();  // create reference to enable looping children later
        this.eventHandler = this.eventHandler.bind(this);
        this.getSources = this.getSources.bind(this);
    }

    getSources() {
        return [window];
    }

    eventHandler(e) {
        if (this.props.logging) {
            console.log(e);
        }
        const eventProps = this.props.events.filter(o => o["event"] === e.type).map(o => o["props"] ? o["props"] : [])[0];
        const eventData = eventProps.reduce(function (o, k) { o[k] = getDescendantProp(e, k); return o; }, {});
        //        eventData.id = e.srcElement.id;
        let filters = [];
        if (eventData.data && eventData.data.type && eventData.data.type === 'filters' && eventData.data.filters) {
            filters = eventData.data.filters;
        }
        this.props.setProps({ filters: filters });
    }

    componentDidMount() {
        const events = this.props.events.map(o => o["event"]);
        this.getSources().forEach(s => events.forEach(e => s.addEventListener(e, this.eventHandler, this.props.useCapture)));
    }

    componentWillUnmount() {
        const events = this.props.events.map(o => o["event"]);
        this.getSources().forEach(s => events.forEach(e => s.removeEventListener(e, this.eventHandler, this.props.useCapture)));
    }

    render() {
        return <div className={this.props.className} style={this.props.style} ref={this.myRef}>
            {this.props.children}
        </div>;
    }
};

DataikuFilterListener.defaultProps = {
    events: [{ "event": "message", "props": ["data"] }],
    filters: {},
    logging: false,
    useCapture: false
};

DataikuFilterListener.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * The event entry specifies which event to listen to, e.g. "click" for click events. The "props" entry specifies
     what event properties to record, e.g. ["x", "y"] to get the cursor position.
     */
    events: PropTypes.arrayOf(PropTypes.shape({
        event: PropTypes.string,
        props: PropTypes.arrayOf(PropTypes.string)
    })),

    /**
     * If true, event information is logged to the javascript console. Useful if you can't remember events props.
     */
    logging: PropTypes.bool,

    /**
     * The children of this component. If any children are provided, the component will listen for events from these
     components. If no children are specified, the component will listen for events from the document object.
     */
    children: PropTypes.node,

    /**
     * The CSS style of the component.
     */
    style: PropTypes.object,

    /**
     * A custom class name.
     */
    className: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    /**
     * Values from the latest event fired by the Dataiku Dashboard Filters.
     */
    filters: PropTypes.array,

    /**
     * Value of useCapture used when registering event listeners.
     */
    useCapture: PropTypes.bool

};