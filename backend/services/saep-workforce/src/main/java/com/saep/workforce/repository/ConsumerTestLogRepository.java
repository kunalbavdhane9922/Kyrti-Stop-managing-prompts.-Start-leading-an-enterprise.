package com.saep.workforce.repository;

import com.saep.workforce.domain.ConsumerTestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsumerTestLogRepository extends JpaRepository<ConsumerTestLog, Long> {
}
