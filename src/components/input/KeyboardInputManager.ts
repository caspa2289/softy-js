type KeyName = string
type EventName = string

export type KeyboardInputConfig = Record<KeyName, EventName>

export type KeyboardInputManagerProps = Partial<{
    config: KeyboardInputConfig
}>

const defaultConfig: KeyboardInputConfig = {
    'KeyA': 'MoveLeft',
    'ArrowLeft': 'MoveLeft',
    'KeyD': 'MoveRight',
    'ArrowRight': 'MoveRight',
    'KeyW': 'MoveForward',
    'ArrowUp': 'MoveForward',
    'KeyS': 'MoveBack',
    'ArrowDown': 'MoveBack',
}

export class KeyboardInputManager {
    private _config: KeyboardInputConfig
    private _state: object //FIXME

    constructor(props?: KeyboardInputManagerProps) {
        this._config = props?.config ?? defaultConfig
        this._state = {}
        this._init()
    }

    get config() {
        return this._config
    }

    set config(value) {
        this._config = value
    }

    private _init() {
        this._initializeState()
        this._addListeners()
    }

    private _initializeState() {
        Object.values(this.config).forEach((action) => {
            this._state[action] = false
        })
    }

    private _addListeners() {
        //FIXME: it might  be better to set up all events in one listener
        Object.keys(this.config).forEach((key) => {
            window.addEventListener('keydown', (evt) => {
                if (evt.code === key) {
                    this._state[this.config[key]] = true
                }
            })
            window.addEventListener('keyup', (evt) => {
                if (evt.code === key) {
                    this._state[this.config[key]] = false
                }
            })
        })
    }

    public isActive(eventName: string): boolean {
        if (this._state[eventName] === undefined) throw new Error(`Event ${eventName} was not provided in the config`)

        return this._state[eventName]
    }
}
