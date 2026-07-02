package com.skillswap.config;

import com.skillswap.entity.Skill;
import com.skillswap.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SkillRepository skillRepository;

    @Override
    public void run(String... args) {
        if (skillRepository.count() > 0) {
            return;
        }

        Map<String, String> defaultSkills = new LinkedHashMap<>();
        defaultSkills.put("Java", "☕");
        defaultSkills.put("Python", "🐍");
        defaultSkills.put("Web Development", "💻");
        defaultSkills.put("UI/UX Design", "🎨");
        defaultSkills.put("Graphic Design", "🖌️");
        defaultSkills.put("Photography", "📷");
        defaultSkills.put("Video Editing", "🎬");
        defaultSkills.put("Guitar", "🎸");
        defaultSkills.put("Baking", "🍰");
        defaultSkills.put("Fitness", "💪");

        defaultSkills.forEach((name, icon) ->
            skillRepository.save(Skill.builder().name(name).icon(icon).build())
        );
    }
}
