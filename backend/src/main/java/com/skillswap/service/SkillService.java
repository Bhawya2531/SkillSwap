package com.skillswap.service;

import com.skillswap.dto.SkillDto;
import com.skillswap.entity.Skill;
import com.skillswap.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SkillDto toDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .icon(skill.getIcon())
                .build();
    }
}
