/** Easy to change multiplier for durations for dev debugging */
const DURATION_MULTIPLIER = 1

// ========================================
// Random Actions
// ========================================

/** Interval range (seconds) between random actions */
export const RANDOM_ACTION_INTERVAL_RANGE: [number, number] = [2, 3]

/** Chances (0-100%) for each random action, must sum to 100 */
export const RANDOM_ACTION_CHANCES = {
  blink: 15,
  blinkTwice: 15,
  lookAround: 0 as number,
  lookCenter: 30,
  followMouse: 40,
} as const

// assert chances sum to 100%
const totalChance = Object.values(RANDOM_ACTION_CHANCES).reduce((sum, chance) => sum + chance, 0)
if (totalChance !== 100) {
  throw new Error(`RANDOM_ACTION_CHANCES must sum to 100, got ${totalChance}`)
}

// ========================================
// Expansion
// ========================================

export const EXPAND_FRAME_DURATION = 0.5 * DURATION_MULTIPLIER
export const EXPAND_EYELID_DELAY = 0.3 * DURATION_MULTIPLIER
export const EXPAND_EYELID_SCALE = 2.425
export const EXPAND_PUPIL_DURATION = 0.5 * DURATION_MULTIPLIER
export const EXPAND_BLINK_DELAY = 0.1 * DURATION_MULTIPLIER
export const COLLAPSE_BLINK_DELAY = 0
export const EXPAND_BLINK_GAP = 0.2 * DURATION_MULTIPLIER

// ========================================
// Blinking
// ========================================

export const BLINK_EYELID_DURATION = 0.2 * DURATION_MULTIPLIER
export const BLINK_PUPIL_FADE_OUT_DELAY = 0.1 * DURATION_MULTIPLIER
export const BLINK_PUPIL_FADE_IN_DELAY = 0.1 * DURATION_MULTIPLIER
export const BLINK_PUPIL_FADE_DURATION = 0.1 * DURATION_MULTIPLIER

// ========================================
// Pupil Look Around
// ========================================

/** Duration range (seconds) pupil stays looking in a direction */
export const PUPIL_LOOK_DURATION_RANGE: [number, number] = [3, 3]

/** Max distance (%) pupil can travel from center on each axis */
export const PUPIL_LOOK_DISTANCE_MAX: [number, number] = [150, 50]

/** Duration range (seconds) pupil follows mouse */
export const PUPIL_FOLLOW_MOUSE_DURATION_RANGE: [number, number] = [2, 5]

/** Duration (seconds) for pupil to move to new position */
export const PUPIL_LOOK_TRANSITION_DURATION = 0.1 * DURATION_MULTIPLIER
