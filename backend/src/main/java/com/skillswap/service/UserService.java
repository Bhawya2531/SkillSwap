package com.skillswap.service;

import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserDtos;
import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
import com.skillswap.exception.ApiException;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public User updateProfile(Long userId, UserDtos.UpdateProfileRequest request) {
        User user = getUserById(userId);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getPhotoUrl() != null) {
            user.setPhotoUrl(request.getPhotoUrl());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getSkillsOfferedIds() != null) {
            Set<Skill> offered = request.getSkillsOfferedIds().stream()
                    .map(id -> skillRepository.findById(id)
                            .orElseThrow(() -> new ApiException("Skill not found: " + id, HttpStatus.NOT_FOUND)))
                    .collect(Collectors.toCollection(HashSet::new));
            user.setSkillsOffered(offered);
        }
        if (request.getSkillsWantedIds() != null) {
            Set<Skill> wanted = request.getSkillsWantedIds().stream()
                    .map(id -> skillRepository.findById(id)
                            .orElseThrow(() -> new ApiException("Skill not found: " + id, HttpStatus.NOT_FOUND)))
                    .collect(Collectors.toCollection(HashSet::new));
            user.setSkillsWanted(wanted);
        }

        return userRepository.save(user);
    }

    public List<User> searchUsers(String query, Long skillId, Long currentUserId) {
        List<User> results;
        if (skillId != null) {
            results = userRepository.findBySkillOfferedId(skillId, currentUserId);
        } else if (query != null && !query.isBlank()) {
            results = userRepository.searchByNameOrBio(query, currentUserId);
        } else {
            results = userRepository.findAllExcept(currentUserId);
        }
        return results;
    }

    public UserDtos.UserProfileDto toProfileDto(User user) {
        return UserDtos.UserProfileDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bio(user.getBio())
                .photoUrl(user.getPhotoUrl())
                .location(user.getLocation())
                .createdAt(user.getCreatedAt())
                .skillsOffered(toSkillDtoSet(user.getSkillsOffered()))
                .skillsWanted(toSkillDtoSet(user.getSkillsWanted()))
                .build();
    }

    public UserDtos.UserSummaryDto toSummaryDto(User user) {
        return UserDtos.UserSummaryDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .photoUrl(user.getPhotoUrl())
                .location(user.getLocation())
                .skillsOffered(toSkillDtoSet(user.getSkillsOffered()))
                .skillsWanted(toSkillDtoSet(user.getSkillsWanted()))
                .build();
    }

    private Set<SkillDto> toSkillDtoSet(Set<Skill> skills) {
        return skills.stream()
                .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).icon(s.getIcon()).build())
                .collect(Collectors.toSet());
    }
}
