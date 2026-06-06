package com.saep.marketplace.model;

import com.saep.common.jpa.BaseTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "marketplace_profession_templates")
@Getter
@Setter
public class ProfessionTemplate extends BaseTenantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profession_id", nullable = false)
    private Profession profession;

    @Column(name = "template_name", nullable = false)
    private String templateName;

    @Column(name = "configuration_json", columnDefinition = "TEXT")
    private String configurationJson;
}
