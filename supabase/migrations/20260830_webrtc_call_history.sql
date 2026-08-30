-- ========================================================================
-- WEBRTC CALL HISTORY & SIGNALING LOG
-- Version: 1.0.0 - Real-time call tracking for audio/video meetings
-- ========================================================================

-- ========================================================================
-- 1. CALL SESSIONS TABLE (Main call history log)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.call_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id TEXT NOT NULL UNIQUE,
    initiator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    call_type TEXT NOT NULL CHECK (call_type IN ('audio', 'video')) DEFAULT 'audio',
    status TEXT NOT NULL CHECK (status IN ('initiated', 'ringing', 'accepted', 'connected', 'ended', 'missed', 'rejected', 'failed')) DEFAULT 'initiated',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    connected_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    end_reason TEXT CHECK (end_reason IN ('completed', 'rejected', 'missed', 'network_error', 'user_cancelled', 'peer_left')),
    ice_connection_state TEXT DEFAULT 'new',
    signaling_state TEXT DEFAULT 'stable',
    connection_quality TEXT CHECK (connection_quality IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
    audio_codec TEXT,
    video_codec TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view call sessions where they are participant"
    ON public.call_sessions FOR SELECT
    TO authenticated
    USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

CREATE POLICY "Initiator can create call session"
    ON public.call_sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Users can end their call session"
    ON public.call_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = initiator_id OR auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = initiator_id OR auth.uid() = recipient_id);

-- Create index for fast queries on user call history
CREATE INDEX idx_call_sessions_initiator ON public.call_sessions(initiator_id, created_at DESC);
CREATE INDEX idx_call_sessions_recipient ON public.call_sessions(recipient_id, created_at DESC);
CREATE INDEX idx_call_sessions_call_id ON public.call_sessions(call_id);
CREATE INDEX idx_call_sessions_status ON public.call_sessions(status);

-- ========================================================================
-- 2. WEBRTC SIGNALING EVENTS LOG (Optional: detailed signaling tracking)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.webrtc_signaling_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_session_id UUID NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('offer', 'answer', 'ice_candidate', 'state_change', 'error')) DEFAULT 'state_change',
    from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webrtc_signaling_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view signaling events for their calls"
    ON public.webrtc_signaling_log FOR SELECT
    TO authenticated
    USING (
        from_user_id = auth.uid() OR to_user_id = auth.uid()
    );

CREATE POLICY "System can log signaling events"
    ON public.webrtc_signaling_log FOR INSERT
    TO authenticated
    WITH CHECK (from_user_id = auth.uid());

CREATE INDEX idx_webrtc_signaling_call_session ON public.webrtc_signaling_log(call_session_id);
CREATE INDEX idx_webrtc_signaling_event_type ON public.webrtc_signaling_log(event_type);

-- ========================================================================
-- 3. CALL QUALITY METRICS (For diagnostics and analytics)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.call_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_session_id UUID NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    audio_packets_sent BIGINT DEFAULT 0,
    audio_packets_received BIGINT DEFAULT 0,
    audio_packets_lost BIGINT DEFAULT 0,
    audio_jitter NUMERIC DEFAULT 0,
    audio_level NUMERIC DEFAULT 0,
    video_frames_sent BIGINT DEFAULT 0,
    video_frames_received BIGINT DEFAULT 0,
    video_frames_dropped BIGINT DEFAULT 0,
    video_frame_rate INTEGER DEFAULT 0,
    video_resolution TEXT,
    bandwidth_available_outgoing BIGINT DEFAULT 0,
    bandwidth_available_incoming BIGINT DEFAULT 0,
    rtt_milliseconds NUMERIC DEFAULT 0,
    cpu_usage_percent NUMERIC DEFAULT 0,
    network_type TEXT CHECK (network_type IN ('wifi', '4g', '5g', '3g', 'ethernet', 'unknown')) DEFAULT 'unknown',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.call_quality_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view metrics for their calls"
    ON public.call_quality_metrics FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.call_sessions
                   WHERE call_sessions.id = call_quality_metrics.call_session_id
                   AND (call_sessions.initiator_id = auth.uid() OR call_sessions.recipient_id = auth.uid())));

CREATE POLICY "Authenticated users can log metrics"
    ON public.call_quality_metrics FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_call_quality_metrics_session ON public.call_quality_metrics(call_session_id);
CREATE INDEX idx_call_quality_metrics_user ON public.call_quality_metrics(user_id);

-- ========================================================================
-- 4. HELPER FUNCTIONS
-- ========================================================================

-- Function to update call duration when call ends
CREATE OR REPLACE FUNCTION public.calculate_call_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND NEW.connected_at IS NOT NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.connected_at))::INTEGER;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate duration on call_sessions update
DROP TRIGGER IF EXISTS on_call_session_ended ON public.call_sessions;
CREATE TRIGGER on_call_session_ended
    BEFORE UPDATE ON public.call_sessions
    FOR EACH ROW EXECUTE FUNCTION public.calculate_call_duration();

-- Function to record active calls for presence
CREATE OR REPLACE FUNCTION public.record_call_connection()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'connected' AND NEW.connected_at IS NULL THEN
        NEW.connected_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to record connection timestamp
DROP TRIGGER IF EXISTS on_call_connected ON public.call_sessions;
CREATE TRIGGER on_call_connected
    BEFORE UPDATE ON public.call_sessions
    FOR EACH ROW EXECUTE FUNCTION public.record_call_connection();

-- ========================================================================
-- 5. CALL HISTORY VIEW (Convenience view for recent calls)
-- ========================================================================
CREATE OR REPLACE VIEW public.recent_call_history AS
SELECT
    cs.id,
    cs.call_id,
    cs.initiator_id,
    p1.name as initiator_name,
    p1.avatar_url as initiator_avatar,
    cs.recipient_id,
    p2.name as recipient_name,
    p2.avatar_url as recipient_avatar,
    cs.call_type,
    cs.status,
    cs.started_at,
    cs.connected_at,
    cs.ended_at,
    cs.duration_seconds,
    cs.end_reason,
    cs.connection_quality,
    cs.created_at
FROM public.call_sessions cs
JOIN public.profiles p1 ON cs.initiator_id = p1.id
JOIN public.profiles p2 ON cs.recipient_id = p2.id
ORDER BY cs.created_at DESC;

-- Grant appropriate permissions on view
GRANT SELECT ON public.recent_call_history TO authenticated;

-- ========================================================================
-- MIGRATION COMPLETE
-- ========================================================================
-- This migration adds comprehensive call tracking and quality metrics
-- to support real-time WebRTC calling with diagnostics and analytics.
