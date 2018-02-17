var events = {};
var hOP = events.hasOwnProperty;

export default {
    /**
     * @global
     * @function subscribe
     * @description
     * Function that creates an event and call a function every time the event is called.
     * @param {String} event Name of your event.
     * @param {Function} listener The function that will be called every time this event is called.
     */
    subscribe(event, listener) {
        // Create the event's object if not yet created
        if (!hOP.call(events, event)) events[event] = [];

        // Add the listener to queue
        var index = events[event].push(listener) - 1;

        // Provide handle back for removal of event
        return {
            remove() {
                delete events[event][index];
            }
        };
    },

    /**
     * @global
     * @function publish
     * @description A function that calls an event created by the subscribe() function.
     * @param {String} event The event that you created by the subscribe() function.
     * @param {Undefined} [args]
     */
    publish(event, args) {
        // If the event doesn't exist, or there's no listeners in queue, just leave
        if (!hOP.call(events, event)) return;

        // Cycle through events queue, fire!
        events[event].forEach((fn) => {
            fn(args);
        });
    }
};
