package com.saep.architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.saep", importOptions = ImportOption.DoNotIncludeTests.class)
public class SaepArchitectureTests {

    @ArchTest
    static final ArchRule workforceCannotAccessOrganizationRepositories =
            noClasses().that().resideInAPackage("..workforce..")
                    .should().accessClassesThat().resideInAPackage("..organization.repository..");

    @ArchTest
    static final ArchRule organizationCannotAccessCompanyPersistence =
            noClasses().that().resideInAPackage("..organization..")
                    .should().accessClassesThat().resideInAPackage("..company.repository..");

    @ArchTest
    static final ArchRule controllersCannotAccessRepositoriesDirectly =
            noClasses().that().resideInAPackage("..controller..")
                    .should().accessClassesThat().resideInAPackage("..repository..");
}
