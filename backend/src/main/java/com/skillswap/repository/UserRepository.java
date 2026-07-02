package com.skillswap.repository;

import com.skillswap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u JOIN u.skillsOffered s WHERE s.id = :skillId AND u.id <> :excludeId")
    List<User> findBySkillOfferedId(@Param("skillId") Long skillId, @Param("excludeId") Long excludeId);

    @Query("SELECT DISTINCT u FROM User u WHERE u.id <> :excludeId AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.bio) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchByNameOrBio(@Param("query") String query, @Param("excludeId") Long excludeId);

    @Query("SELECT u FROM User u WHERE u.id <> :excludeId")
    List<User> findAllExcept(@Param("excludeId") Long excludeId);
}
