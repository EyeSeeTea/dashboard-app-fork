import debounce from 'lodash/debounce'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

const defaultDebounceMs = 100
const defaultBufferFactor = 0.25
const observerConfig = { attributes: true, childList: false, subtree: false }

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        bufferFactor: PropTypes.number,
        className: PropTypes.string,
        debounceMs: PropTypes.number,
        forceLoadCount: PropTypes.number,
        name: PropTypes.string,
        style: PropTypes.object,
    }
    static defaultProps = {
        debounceMs: defaultDebounceMs,
        bufferFactor: defaultBufferFactor,
        forceLoadCount: 0,
    }

    state = {
        shouldLoad: false,
        internalForceLoadCount: 0,
    }
    containerRef = null
    debouncedCheckShouldLoad = null
    handlerOptions = { passive: true }
    observer = null

    checkShouldLoad() {
        if (!this.containerRef) {
            return
        }

        // force load item regardless of its position
        if (this.shouldForceLoad() && !this.state.shouldLoad) {
            this.setState({ shouldLoad: true })
            this.setState({
                internalForceLoadCount: this.props.forceLoadCount,
            })
            this.removeHandler()
            return
        }

        const bufferPx = this.props.bufferFactor * window.innerHeight
        const rect = this.containerRef.getBoundingClientRect()

        // load item if it is near viewport
        if (
            rect.bottom > -bufferPx &&
            rect.top < window.innerHeight + bufferPx
        ) {
            this.setState({ shouldLoad: true })
            this.removeHandler()
        }
    }

    registerHandler() {
        this.debouncedCheckShouldLoad = debounce(
            () => this.checkShouldLoad(),
            this.props.debounceMs
        )

        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.addEventListener(
                'scroll',
                this.debouncedCheckShouldLoad,
                this.handlerOptions
            )
        })

        const mutationCallback = mutationsList => {
            const styleChanged = mutationsList.find(
                mutation => mutation.attributeName === 'style'
            )

            if (styleChanged) {
                this.debouncedCheckShouldLoad()
            }
        }

        this.observer = new MutationObserver(mutationCallback)
        this.observer.observe(this.containerRef, observerConfig)
    }

    removeHandler() {
        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.removeEventListener(
                'scroll',
                this.debouncedCheckShouldLoad,
                this.handlerOptions
            )
        })

        this.observer.disconnect()
    }

    shouldForceLoad() {
        return this.props.forceLoadCount > this.state.internalForceLoadCount
    }

    componentDidMount() {
        this.registerHandler()
        this.checkShouldLoad()
    }

    componentDidUpdate() {
        if (this.shouldForceLoad() && !this.state.shouldLoad) {
            this.checkShouldLoad()
        }
    }

    componentWillUnmount() {
        this.removeHandler()
    }

    render() {
        const { children, className, style, ...props } = this.props

        const shouldLoad = this.state.shouldLoad || this.shouldForceLoad()

        const eventProps = pick(props, [
            'onMouseDown',
            'onTouchStart',
            'onMouseUp',
            'onTouchEnd',
        ])

        return (
            <div
                ref={ref => (this.containerRef = ref)}
                style={style}
                className={className}
                data-test={`dashboarditem-${props.name}`}
                {...eventProps}
            >
                {shouldLoad && children}
            </div>
        )
    }
}

export default ProgressiveLoadingContainer
