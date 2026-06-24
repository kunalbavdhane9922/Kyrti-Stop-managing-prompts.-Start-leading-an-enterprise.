package com.saep.outbox.repository;

import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, String> {
    @Query(value = "SELECT * FROM outbox_events WHERE ((status IN :statuses AND (next_attempt_at IS NULL OR next_attempt_at <= NOW())) OR (status = 'PROCESSING' AND last_attempt_at < NOW() - INTERVAL '15 minutes')) ORDER BY created_at ASC LIMIT :limit FOR UPDATE SKIP LOCKED", nativeQuery = true)
    List<OutboxEvent> findAndLockNextEvents(@Param("statuses") List<String> statuses, @Param("limit") int limit);
    
    long countByStatus(EventStatus status);
}
