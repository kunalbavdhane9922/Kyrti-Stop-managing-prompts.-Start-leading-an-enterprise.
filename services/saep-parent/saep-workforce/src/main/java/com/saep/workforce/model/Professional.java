package com.saep.workforce.model;

import com.saep.common.jpa.BaseTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "workforce_professionals")
@Getter
@Setter
public class Professional extends BaseTenantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "profession_id", nullable = false)
    private UUID professionId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String status = "AVAILABLE";
}
