const ACTION_CODE = {
    NEXT_WAVE_ACTION: 0,
    ACTIVATE_CARD_ACTION:1,

}

const ACTION_DESERIALIZER = {
    0: NextWaveAction.deserializer,
    1: ActivateCardAction.deserializer,
}