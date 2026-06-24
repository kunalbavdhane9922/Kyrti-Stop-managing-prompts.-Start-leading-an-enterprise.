package com.saep.workforce.domain;

public final class ScoreBounds {
    private ScoreBounds() {} // Utility class

    // Capabilities usually go from 0 (Novice) upwards.
    public static final double MIN_CAPABILITY_SCORE = 0.0;
    public static final double MAX_CAPABILITY_SCORE = 10000.0;

    public static final double MIN_SKILL_SCORE = 0.0;
    public static final double MAX_SKILL_SCORE = 10000.0;

    public static final double MIN_READINESS_SCORE = 0.0;
    public static final double MAX_READINESS_SCORE = 100.0; // Readiness might be a percentage

    // Reputation can go negative if penalized heavily.
    public static final double MIN_REPUTATION_SCORE = -1000.0;
    public static final double MAX_REPUTATION_SCORE = 10000.0;
}
