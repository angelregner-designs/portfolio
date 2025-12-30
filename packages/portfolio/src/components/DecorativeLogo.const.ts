/** Easy to change multiplier for durations for dev debugging */
const DURATION_MULTIPLIER = 1

// ========================================
// Expansion
// ========================================

export const EXPAND_FRAME_DURATION = 0.5 * DURATION_MULTIPLIER

export const EXPAND_EYELID_DURATION = 0.5 * DURATION_MULTIPLIER
export const EXPAND_EYELID_DELAY = 0.3 * DURATION_MULTIPLIER
export const EXPAND_EYELID_SCALE = 2.425

export const EXPAND_PUPIL_DURATION = 0.5 * DURATION_MULTIPLIER

export const EXPAND_BLINK_DELAY = 0.1 * DURATION_MULTIPLIER
export const COLLAPSE_BLINK_DELAY = 0.0 * DURATION_MULTIPLIER
export const EXPAND_BLINK_GAP = 0.2 * DURATION_MULTIPLIER

// ========================================
// Blinking
// ========================================

/** Interval range (seconds) between automatic blinks */
export const AUTO_BLINK_INTERVAL_RANGE: [number, number] = [2, 6]

/** Chance (0-1) of blinking twice in succession */
export const DOUBLE_BLINK_CHANCE = 0.33

/** Delay (seconds) before second blink in double blink */
export const DOUBLE_BLINK_DELAY = 0 * DURATION_MULTIPLIER

export const BLINK_EYELID_DURATION = 0.3 * DURATION_MULTIPLIER
export const BLINK_PUPIL_FADE_OUT_DELAY = 0.1 * DURATION_MULTIPLIER

export const BLINK_PUPIL_FADE_IN_DELAY = 0.1 * DURATION_MULTIPLIER

export const BLINK_PUPIL_FADE_DURATION = 0.1 * DURATION_MULTIPLIER

// ========================================
// Pupil Look Around
// ========================================

/** Interval range (seconds) between pupil direction changes */
export const PUPIL_LOOK_INTERVAL_RANGE: [number, number] = [0.1, 3]

/** Duration range (seconds) pupil stays looking in a direction */
export const PUPIL_LOOK_DURATION_RANGE: [number, number] = [0.1, 3]

/** Max distance (%) pupil can travel from center on each axis */
export const PUPIL_LOOK_DISTANCE_MAX: [number, number] = [150, 50]

/** Chance (0-1) that pupil returns to center instead of random direction */
export const PUPIL_LOOK_CENTER_CHANCE = 0.33

/** Chance (0-1) that pupil follows mouse instead of random direction */
export const PUPIL_FOLLOW_MOUSE_CHANCE = 0.5

/** Duration range (seconds) pupil follows mouse */
export const PUPIL_FOLLOW_MOUSE_DURATION_RANGE: [number, number] = [3, 5]

/** Duration (seconds) for pupil to move to new position */
export const PUPIL_LOOK_TRANSITION_DURATION = 0.1 * DURATION_MULTIPLIER
