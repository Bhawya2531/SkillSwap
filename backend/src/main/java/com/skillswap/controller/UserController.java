package com.skillswap.controller;

import com.skillswap.dto.UserDtos;
import com.skillswap.entity.User;
import com.skillswap.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDtos.UserProfileDto> getMyProfile(Authentication authentication) {
        User current = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(userService.toProfileDto(current));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDtos.UserProfileDto> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UserDtos.UpdateProfileRequest request) {
        User current = userService.getUserByEmail(authentication.getName());
        User updated = userService.updateProfile(current.getId(), request);
        return ResponseEntity.ok(userService.toProfileDto(updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDtos.UserSummaryDto> getUserProfile(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userService.toSummaryDto(user));
    }

    @GetMapping
    public ResponseEntity<List<UserDtos.UserSummaryDto>> browseUsers(
            Authentication authentication,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long skillId) {
        User current = userService.getUserByEmail(authentication.getName());
        List<User> results = userService.searchUsers(query, skillId, current.getId());
        List<UserDtos.UserSummaryDto> dtos = results.stream()
                .map(userService::toSummaryDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
