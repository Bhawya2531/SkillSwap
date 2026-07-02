package com.skillswap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class UserDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileDto {
        private Long id;
        private String fullName;
        private String email;
        private String bio;
        private String photoUrl;
        private String location;
        private LocalDateTime createdAt;
        private Set<SkillDto> skillsOffered;
        private Set<SkillDto> skillsWanted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummaryDto {
        private Long id;
        private String fullName;
        private String bio;
        private String photoUrl;
        private String location;
        private Set<SkillDto> skillsOffered;
        private Set<SkillDto> skillsWanted;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String fullName;
        private String bio;
        private String photoUrl;
        private String location;
        private List<Long> skillsOfferedIds;
        private List<Long> skillsWantedIds;
    }
}
