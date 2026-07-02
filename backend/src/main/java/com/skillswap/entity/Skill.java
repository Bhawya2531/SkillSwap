package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 50)
    private String icon;

    @ManyToMany(mappedBy = "skillsOffered")
    @Builder.Default
    @ToString.Exclude
    private Set<User> offeredByUsers = new HashSet<>();

    @ManyToMany(mappedBy = "skillsWanted")
    @Builder.Default
    @ToString.Exclude
    private Set<User> wantedByUsers = new HashSet<>();
}
