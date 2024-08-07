const { useEffect, createContext, useRef } = require("react")

const WebSocketContext = createContext()

function WebSocketProvider({ children }) {
    const ws = useRef(null)
    const channels = useRef({}) // maps each channel to the callback
    /* called from a component that registers a callback for a channel */
    const subscribe = (channel, callback) => {
        channels.current[channel] = callback
    }
    /* remove callback  */
    const unsubscribe = (channel) => {
        delete channels.current[channel]
    }
    useEffect(() => {
        /* WS initialization and cleanup */
        ws.current = new WebSocket('ws://ws-host:ws-port')
        ws.current.onopen = () => { console.log('WS open') }
        ws.current.onclose = () => { console.log('WS close') }
        ws.current.onmessage = (message) => {
            const { type, ...data } = JSON.parse(message.data)
            const chatChannel = `${type}_${data.chat}`

            // lookup for an existing chat in which this message belongs
            // if no chat is subscribed send message to generic channel
            if (channels.current[chatChannel]) {
                /* in chat component the subscribed channel is `MESSAGE_CREATE_${id}` */
                channels.current[chatChannel](data)
            } else {
                /* in notifications wrapper the subscribed channel is `MESSAGE_CREATE` */
                channels.current[type]?.(data)
            }
        }
        return () => { ws.current.close() }
    }, [])

    /* WS provider dom */
    /* subscribe and unsubscribe are the only required prop for the context */
    return (
        <WebSocketContext.Provider value={[subscribe, unsubscribe]}>
            {children}
        </WebSocketContext.Provider>
    )
}

export { WebSocketContext, WebSocketProvider }