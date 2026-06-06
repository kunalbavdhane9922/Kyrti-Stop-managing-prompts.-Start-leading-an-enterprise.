package com.saep.marketplace.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "marketplace_professions")
@Getter
@Setter
public class Profession extends com.saep.common.jpa.BaseTenantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @ManyToMany
    @JoinTable(
        name = "marketplace_profession_skills",
        joinColumns = @JoinColumn(name = "profession_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private java.util.Set<Skill> skills;
}
